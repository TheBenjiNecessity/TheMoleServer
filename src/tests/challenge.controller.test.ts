import RoomSampleService from '../services/sample/room.sample';
import Challenge from '../models/challenge.model';
import { getMockRoomController } from '../services/sample/room-controller.sample';

function getMockComponents(numPlayers, withRoles = false) {
	let room = RoomSampleService.getMockRoomWithOneChallenge(numPlayers, withRoles);
	let roomController = getMockRoomController();
	let challengeController = room.currentEpisode.getCurrentChallengeController(roomController);

	roomController.setRoom(room);

	return { room, roomController, challengeController };
}

test('Checks "raiseHand" method', () => {
	let { room, roomController, challengeController } = getMockComponents(10, true);
	let { roomcode } = room;

	let player = room.playersStillPlaying[0];

	challengeController.raiseHand(roomcode, player.name, 'test');
	let sampleChallenge = roomController.getRoom(roomcode).currentEpisode.currentChallenge;

	expect(sampleChallenge.raisedHands.length).toBe(1);
	expect(sampleChallenge.raisedHands[0].roleName).toBe('test');
	expect(sampleChallenge.raisedHands[0].playerName).toBe('test1');

	challengeController.raiseHand(roomcode, player.name, 'test2');
	sampleChallenge = roomController.getRoom(roomcode).currentEpisode.currentChallenge;

	expect(sampleChallenge.raisedHands.length).toBe(1);
	expect(sampleChallenge.raisedHands[0].roleName).toBe('test2');
	expect(sampleChallenge.raisedHands[0].playerName).toBe('test1');
});

test('Checks "raiseHand" method error', () => {
	let { room, roomController, challengeController } = getMockComponents(10, true);
	let { roomcode } = room;

	roomController.setRoom(room);
	room = roomController.getRoom(roomcode);
	challengeController.performEvent(roomcode, 'moveNext');
	let result = challengeController.raiseHand(roomcode, room.playersStillPlaying[0].name, 'test');
	expect(result).toBeUndefined();
});

test('Checks "agreeToRoles" method', () => {
	let { room, roomController, challengeController } = getMockComponents(10, true);
	let { roomcode } = room;
	let player1 = room.playersStillPlaying[0];
	let player2 = room.playersStillPlaying[1];

	challengeController.raiseHand(roomcode, room.playersStillPlaying[0].name, 'test1');
	challengeController.raiseHand(roomcode, room.playersStillPlaying[1].name, 'test1');
	challengeController.raiseHand(roomcode, room.playersStillPlaying[2].name, 'test1');
	challengeController.raiseHand(roomcode, room.playersStillPlaying[3].name, 'test1');
	challengeController.raiseHand(roomcode, room.playersStillPlaying[4].name, 'test1');

	challengeController.raiseHand(roomcode, room.playersStillPlaying[5].name, 'test2');
	challengeController.raiseHand(roomcode, room.playersStillPlaying[6].name, 'test2');
	challengeController.raiseHand(roomcode, room.playersStillPlaying[7].name, 'test2');
	challengeController.raiseHand(roomcode, room.playersStillPlaying[8].name, 'test2');
	challengeController.raiseHand(roomcode, room.playersStillPlaying[9].name, 'test2');

	challengeController.agreeToRoles(roomcode, player1.name);
	let sampleChallenge = roomController.getRoom(roomcode).currentEpisode.currentChallenge;

	expect(sampleChallenge.agreedPlayerNames.length).toBe(1);
	expect(sampleChallenge.agreedPlayerNames[0]).toBe('test1');

	challengeController.agreeToRoles(roomcode, player1.name);
	sampleChallenge = roomController.getRoom(roomcode).currentEpisode.currentChallenge;

	expect(sampleChallenge.agreedPlayerNames.length).toBe(1);
	expect(sampleChallenge.agreedPlayerNames[0]).toBe('test1');

	challengeController.agreeToRoles(roomcode, player2.name);
	sampleChallenge = roomController.getRoom(roomcode).currentEpisode.currentChallenge;

	expect(sampleChallenge.agreedPlayerNames.length).toBe(2);
	expect(sampleChallenge.agreedPlayerNames[1]).toBe('test2');
});

test('Checks "agreeToRoles" method error', () => {
	let { room, roomController, challengeController } = getMockComponents(10, true);
	const { roomcode } = room;

	roomController.setRoom(room);
	room = roomController.getRoom(roomcode);
	challengeController.performEvent(roomcode, 'moveNext');
	const result = challengeController.agreeToRoles(roomcode, room.playersStillPlaying[0].name);
	expect(result).toBeUndefined();
});

test('Checks "addPlayerVote" method', () => {
	let { room, roomController, challengeController } = getMockComponents(10);
	let { roomcode } = room;
	let player = room.playersStillPlaying[0];

	roomController.setRoom(room);
	challengeController.addPlayerVote(roomcode, player.name);
	let challenge = roomController.getRoom(roomcode).currentEpisode.currentChallenge as Challenge;

	expect(Object.keys(challenge.votedPlayers).length).toBe(1);
	expect(challenge.votedPlayers[player.name]).toBe(1);
});

test('Checks "removePlayerVote" method', () => {
	let { room, roomController, challengeController } = getMockComponents(10);
	let { roomcode } = room;
	let player = room.playersStillPlaying[0];

	roomController.setRoom(room);

	let pathChallenge = roomController.getRoom(roomcode).currentEpisode.currentChallenge;

	challengeController.addPlayerVote(roomcode, player.name);
	pathChallenge = roomController.getRoom(roomcode).currentEpisode.currentChallenge;
	expect(Object.keys(pathChallenge.votedPlayers).length).toBe(1);
	expect(pathChallenge.votedPlayers[player.name]).toBe(1);

	challengeController.removePlayerVote(roomcode, player.name);
	pathChallenge = roomController.getRoom(roomcode).currentEpisode.currentChallenge;
	expect(Object.keys(pathChallenge.votedPlayers).length).toBe(0);
	expect(typeof pathChallenge.votedPlayers[player.name]).toBe('undefined');

	challengeController.removePlayerVote(roomcode, player.name);
	pathChallenge = roomController.getRoom(roomcode).currentEpisode.currentChallenge;
	expect(Object.keys(pathChallenge.votedPlayers).length).toBe(0);
	expect(typeof pathChallenge.votedPlayers[player.name]).toBe('undefined');
});
