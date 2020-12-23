import Player from '../models/player.model';
import RoomSampleService from '../services/sample/room.sample';
import EpisodeSampleService from '../services/sample/episode.sample';
import ChallengeSampleService from '../services/sample/challenge.sample';
import Challenge from '../models/challenge.model';

function getMockRoom(numPlayers) {
	let room = RoomSampleService.getTestRoomForNumPlayers(numPlayers);
	room.currentEpisode = EpisodeSampleService.getTestEpisode(room.playersStillPlaying);
	return room;
}

function getMockComponents(numPlayers, withRoles = false) {
	let room = getMockRoom(numPlayers);
	let challenge = ChallengeSampleService.getTestChallenge(room.playersStillPlaying, withRoles);

	return { challenge };
}

test('Checks "addAgreedPlayer" method', () => {
	let { challenge } = getMockComponents(10);
	let player = new Player('test');
	challenge.addAgreedPlayer(player.name);

	expect(challenge.agreedPlayerNames.length).toBe(1);
	expect(challenge.agreedPlayerNames[0]).toBe('test');

	challenge.addAgreedPlayer(player.name);

	expect(challenge.agreedPlayerNames.length).toBe(1);
	expect(challenge.agreedPlayerNames[0]).toBe('test');
});

test('Checks "raiseHandForPlayer" method', () => {
	let { challenge } = getMockComponents(10);
	challenge.raiseHandForPlayer('test', 'test');

	expect(challenge.raisedHands.length).toBe(1);
	expect(challenge.raisedHands[0].roleName).toBe('test');
	expect(challenge.raisedHands[0].playerName).toBe('test');

	challenge.raiseHandForPlayer('test', 'test');

	expect(challenge.raisedHands.length).toBe(1);
	expect(challenge.raisedHands[0].roleName).toBe('test');
	expect(challenge.raisedHands[0].playerName).toBe('test');

	challenge.raiseHandForPlayer('test2', 'test2');

	expect(challenge.raisedHands.length).toBe(2);
	expect(challenge.raisedHands[1].roleName).toBe('test2');
	expect(challenge.raisedHands[1].playerName).toBe('test2');

	challenge.raiseHandForPlayer('test', 'test3');

	expect(challenge.raisedHands.length).toBe(2);
	expect(challenge.raisedHands[0].roleName).toBe('test3');
	expect(challenge.raisedHands[0].playerName).toBe('test');
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

test('Tests raisedHandsAreValid getter', () => {
	let { challenge } = getMockComponents(10, true);

	expect(challenge.roles.length).toBeGreaterThan(0);

	expect(challenge.raisedHandsAreValid).toBe(false);
	challenge.raiseHandForPlayer(challenge.players[0].name, 'test1');
	expect(challenge.raisedHandsAreValid).toBe(false);
	challenge.raiseHandForPlayer(challenge.players[1].name, 'test1');
	expect(challenge.raisedHandsAreValid).toBe(false);
	challenge.raiseHandForPlayer(challenge.players[2].name, 'test1');
	expect(challenge.raisedHandsAreValid).toBe(false);
	challenge.raiseHandForPlayer(challenge.players[3].name, 'test1');
	expect(challenge.raisedHandsAreValid).toBe(false);
	challenge.raiseHandForPlayer(challenge.players[4].name, 'test1');
	expect(challenge.raisedHandsAreValid).toBe(false);

	challenge.raiseHandForPlayer(challenge.players[5].name, 'test2');
	expect(challenge.raisedHandsAreValid).toBe(false);
	challenge.raiseHandForPlayer(challenge.players[6].name, 'test2');
	expect(challenge.raisedHandsAreValid).toBe(false);
	challenge.raiseHandForPlayer(challenge.players[7].name, 'test2');
	expect(challenge.raisedHandsAreValid).toBe(false);
	challenge.raiseHandForPlayer(challenge.players[8].name, 'test2');
	expect(challenge.raisedHandsAreValid).toBe(false);
	challenge.raiseHandForPlayer(challenge.players[9].name, 'test2');
	expect(challenge.raisedHandsAreValid).toBe(true);
});

test('Tests setRoles', () => {
	let { challenge } = getMockComponents(10, true);

	expect(challenge.roles.length).toBeGreaterThan(0);

	challenge.raiseHandForPlayer(challenge.players[0].name, 'test1');
	challenge.raiseHandForPlayer(challenge.players[1].name, 'test1');
	challenge.raiseHandForPlayer(challenge.players[2].name, 'test1');
	challenge.raiseHandForPlayer(challenge.players[3].name, 'test1');
	challenge.raiseHandForPlayer(challenge.players[4].name, 'test1');

	challenge.setRoles();

	for (const player of challenge.players) {
		expect(player.currentRoleName).toBeNull();
	}

	challenge.raiseHandForPlayer(challenge.players[5].name, 'test2');
	challenge.raiseHandForPlayer(challenge.players[6].name, 'test2');
	challenge.raiseHandForPlayer(challenge.players[7].name, 'test2');
	challenge.raiseHandForPlayer(challenge.players[8].name, 'test2');
	challenge.raiseHandForPlayer(challenge.players[9].name, 'test2');

	challenge.setRoles();

	for (let i = 0; i < challenge.players.length; i++) {
		const player = challenge.players[i];
		const roleName = i < 5 ? 'test1' : 'test2';
		expect(player.currentRoleName).toBe(roleName);
	}
});

test('Tests moveNext', () => {
	let { challenge } = getMockComponents(10);
	challenge.state = Challenge.CHALLENGE_STATES.ROLE_SELECTION;
	challenge.moveNext();
	expect(challenge.state).toBe(Challenge.CHALLENGE_STATES.IN_GAME);
	challenge.moveNext();
	expect(challenge.state).toBe(Challenge.CHALLENGE_STATES.CHALLENGE_END);
	challenge.moveNext();
	expect(challenge.state).toBe(Challenge.CHALLENGE_STATES.CHALLENGE_END);
});

// moveNext() {
// 	switch (this.state) {
// 		case Challenge.CHALLENGE_STATES.ROLE_SELECTION:
// 			this.state = Challenge.CHALLENGE_STATES.IN_GAME;
// 			break;
// 		case Challenge.CHALLENGE_STATES.IN_GAME:
// 			this.state = Challenge.CHALLENGE_STATES.CHALLENGE_END;
// 			break;
// 		default:
// 			break;
// 	}
// }
