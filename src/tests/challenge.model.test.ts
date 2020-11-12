import Player from '../models/player.model';
import RoomSampleService from '../models/samples/room.sample';
import EpisodeSampleService from '../models/samples/episode.sample';
import ChallengeSampleService from '../models/samples/challenge.sample';

function getMockRoom(numPlayers) {
	let room = RoomSampleService.getTestRoomForNumPlayers(numPlayers);
	room.currentEpisode = EpisodeSampleService.getTestEpisode(room);
	return room;
}

function getMockComponents(numPlayers) {
	let room = getMockRoom(numPlayers);
	let challenge = ChallengeSampleService.getTestChallenge(room);

	return { challenge };
}

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
