import Challenge from '../src/models/challenge.model';
import Player from '../src/models/player.model';
import RoomSampleService from './room.sample';
import EpisodeSampleService from './episode.sample';

function getMockRoom(numPlayers) {
	let room = RoomSampleService.getTestRoomForNumPlayers(numPlayers);
	room.currentEpisode = EpisodeSampleService.getTestEpisode(room);
	return room;
}

function getMockComponents(numPlayers) {
	let room = getMockRoom(numPlayers);
	let challenge = new Challenge(room.playersStillPlaying, 'Path', '', 10, 5, [], 'game', [], 'path');

	return { challenge };
}

test('Checks "canSupportNumPlayers" method', () => {
	let { challenge } = getMockComponents(10);

	expect(challenge.canSupportNumPlayers(1)).toBe(false);
	expect(challenge.canSupportNumPlayers(2)).toBe(false);
	expect(challenge.canSupportNumPlayers(3)).toBe(false);
	expect(challenge.canSupportNumPlayers(4)).toBe(false);
	expect(challenge.canSupportNumPlayers(5)).toBe(true);
	expect(challenge.canSupportNumPlayers(6)).toBe(true);
	expect(challenge.canSupportNumPlayers(7)).toBe(true);
	expect(challenge.canSupportNumPlayers(8)).toBe(true);
	expect(challenge.canSupportNumPlayers(9)).toBe(true);
	expect(challenge.canSupportNumPlayers(10)).toBe(true);
});

test('Checks "addAgreedPlayer" method', () => {
	let { challenge } = getMockComponents(10);
	let player = new Player('test');
	challenge.addAgreedPlayer(player);

	expect(challenge.agreedPlayers.length).toBe(1);
	expect(challenge.agreedPlayers[0].name).toBe('test');

	challenge.addAgreedPlayer(player);

	expect(challenge.agreedPlayers.length).toBe(1);
	expect(challenge.agreedPlayers[0].name).toBe('test');
});

test('Checks "raiseHandForPlayer" method', () => {
	let { challenge } = getMockComponents(10);
	challenge.raiseHandForPlayer(new Player('test'), 'test');

	expect(challenge.raisedHands.length).toBe(1);
	expect(challenge.raisedHands[0].role).toBe('test');
	expect(challenge.raisedHands[0].player.name).toBe('test');

	challenge.raiseHandForPlayer(new Player('test'), 'test');

	expect(challenge.raisedHands.length).toBe(1);
	expect(challenge.raisedHands[0].role).toBe('test');
	expect(challenge.raisedHands[0].player.name).toBe('test');

	challenge.raiseHandForPlayer(new Player('test2'), 'test2');

	expect(challenge.raisedHands.length).toBe(2);
	expect(challenge.raisedHands[1].role).toBe('test2');
	expect(challenge.raisedHands[1].player.name).toBe('test2');

	challenge.raiseHandForPlayer(new Player('test'), 'test3');

	expect(challenge.raisedHands.length).toBe(2);
	expect(challenge.raisedHands[0].role).toBe('test3');
	expect(challenge.raisedHands[0].player.name).toBe('test');
});

test('Checks "setVotedPlayer" method', () => {
	let { challenge } = getMockComponents(10);

	challenge.setVotedPlayer('test');
	expect(Object.keys(challenge.votedPlayers).length).toBe(1);
	expect(challenge.votedPlayers['test']).toBe(1);

	challenge.setVotedPlayer('test');
	expect(Object.keys(challenge.votedPlayers).length).toBe(1);
	expect(challenge.votedPlayers['test']).toBe(2);

	challenge.setVotedPlayer('test1');
	expect(Object.keys(challenge.votedPlayers).length).toBe(2);
	expect(challenge.votedPlayers['test1']).toBe(1);
});

test('Checks "removeVotedPlayer" method', () => {
	let { challenge } = getMockComponents(10);

	challenge.setVotedPlayer('test');
	challenge.setVotedPlayer('test');
	challenge.setVotedPlayer('test1');

	challenge.removeVotedPlayer('test');

	expect(Object.keys(challenge.votedPlayers).length).toBe(2);
	expect(challenge.votedPlayers['test']).toBe(1);

	challenge.removeVotedPlayer('test1');

	expect(Object.keys(challenge.votedPlayers).length).toBe(1);
	expect(typeof challenge.votedPlayers['test1']).toBe('undefined');
});
