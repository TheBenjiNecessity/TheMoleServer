import Challenge from '../models/challenge.model';
import RoomController from '../controllers/room.controller';
import Room from '../models/room.model';
import ChallengeController from '../controllers/challenge.controller';
import { getMockComponents } from '../services/sample/mock-components.service';

let testRoom: Room = null;
let testRoomController: RoomController = null;
let testRoomCode: string = null;
let testChallengeController: ChallengeController = null;
beforeEach(() => {
	let { roomcode, roomController } = getMockComponents(10, [ true ]);
	testRoomController = roomController;
	testRoomCode = roomcode;
	testRoom = testRoomController.getRoom(testRoomCode);
	testRoom.generateCurrentEpisode();
	testRoomController.setRoom(testRoom);
	testChallengeController = testRoom.currentEpisode.getCurrentChallengeController(testRoomController);
});

test('Checks "raiseHand" method', () => {
	let player = testRoom.playersStillPlaying[0];

	testChallengeController.raiseHand(testRoomCode, player.name, 'test');
	let sampleChallenge = testRoomController.getRoom(testRoomCode).currentEpisode.currentChallenge;

	expect(sampleChallenge.raisedHands.length).toBe(1);
	expect(sampleChallenge.raisedHands[0].roleName).toBe('test');
	expect(sampleChallenge.raisedHands[0].playerName).toBe('test1');

	testChallengeController.raiseHand(testRoomCode, player.name, 'test2');
	sampleChallenge = testRoomController.getRoom(testRoomCode).currentEpisode.currentChallenge;

	expect(sampleChallenge.raisedHands.length).toBe(1);
	expect(sampleChallenge.raisedHands[0].roleName).toBe('test2');
	expect(sampleChallenge.raisedHands[0].playerName).toBe('test1');
});

test('Checks "raiseHand" method error', () => {
	testChallengeController.performEvent(testRoomCode, 'moveNext');
	let result = testChallengeController.raiseHand(testRoomCode, testRoom.playersStillPlaying[0].name, 'test');
	expect(result).toBeUndefined();
});

test('Checks "agreeToRoles" method', () => {
	let player1 = testRoom.playersStillPlaying[0];
	let player2 = testRoom.playersStillPlaying[1];

	testChallengeController.raiseHand(testRoomCode, testRoom.playersStillPlaying[0].name, 'test1');
	testChallengeController.raiseHand(testRoomCode, testRoom.playersStillPlaying[1].name, 'test1');
	testChallengeController.raiseHand(testRoomCode, testRoom.playersStillPlaying[2].name, 'test1');
	testChallengeController.raiseHand(testRoomCode, testRoom.playersStillPlaying[3].name, 'test1');
	testChallengeController.raiseHand(testRoomCode, testRoom.playersStillPlaying[4].name, 'test1');

	testChallengeController.raiseHand(testRoomCode, testRoom.playersStillPlaying[5].name, 'test2');
	testChallengeController.raiseHand(testRoomCode, testRoom.playersStillPlaying[6].name, 'test2');
	testChallengeController.raiseHand(testRoomCode, testRoom.playersStillPlaying[7].name, 'test2');
	testChallengeController.raiseHand(testRoomCode, testRoom.playersStillPlaying[8].name, 'test2');
	testChallengeController.raiseHand(testRoomCode, testRoom.playersStillPlaying[9].name, 'test2');

	testChallengeController.agreeToRoles(testRoomCode, player1.name);
	let sampleChallenge = testRoomController.getRoom(testRoomCode).currentEpisode.currentChallenge;

	expect(sampleChallenge.agreedPlayerNames.length).toBe(1);
	expect(sampleChallenge.agreedPlayerNames[0]).toBe('test1');

	testChallengeController.agreeToRoles(testRoomCode, player1.name);
	sampleChallenge = testRoomController.getRoom(testRoomCode).currentEpisode.currentChallenge;

	expect(sampleChallenge.agreedPlayerNames.length).toBe(1);
	expect(sampleChallenge.agreedPlayerNames[0]).toBe('test1');

	testChallengeController.agreeToRoles(testRoomCode, player2.name);
	sampleChallenge = testRoomController.getRoom(testRoomCode).currentEpisode.currentChallenge;

	expect(sampleChallenge.agreedPlayerNames.length).toBe(2);
	expect(sampleChallenge.agreedPlayerNames[1]).toBe('test2');
});

test('Checks "agreeToRoles" method error', () => {
	testRoomController.setRoom(testRoom);
	testRoom = testRoomController.getRoom(testRoomCode);
	testChallengeController.performEvent(testRoomCode, 'moveNext');
	const result = testChallengeController.agreeToRoles(testRoomCode, testRoom.playersStillPlaying[0].name);
	expect(result).toBeUndefined();
});

test('Checks "addPlayerVote" method', () => {
	let player = testRoom.playersStillPlaying[0];

	testRoomController.setRoom(testRoom);
	testChallengeController.addPlayerVote(testRoomCode, player.name);
	let challenge = testRoomController.getRoom(testRoomCode).currentEpisode.currentChallenge as Challenge;

	expect(Object.keys(challenge.votedPlayers).length).toBe(1);
	expect(challenge.votedPlayers[player.name]).toBe(1);
});

test('Checks "removePlayerVote" method', () => {
	let player = testRoom.playersStillPlaying[0];
	let pathChallenge = testRoom.currentEpisode.currentChallenge;

	testChallengeController.addPlayerVote(testRoomCode, player.name);
	pathChallenge = testRoomController.getRoom(testRoomCode).currentEpisode.currentChallenge;
	expect(Object.keys(pathChallenge.votedPlayers).length).toBe(1);
	expect(pathChallenge.votedPlayers[player.name]).toBe(1);

	testChallengeController.removePlayerVote(testRoomCode, player.name);
	pathChallenge = testRoomController.getRoom(testRoomCode).currentEpisode.currentChallenge;
	expect(Object.keys(pathChallenge.votedPlayers).length).toBe(0);
	expect(typeof pathChallenge.votedPlayers[player.name]).toBe('undefined');

	testChallengeController.removePlayerVote(testRoomCode, player.name);
	pathChallenge = testRoomController.getRoom(testRoomCode).currentEpisode.currentChallenge;
	expect(Object.keys(pathChallenge.votedPlayers).length).toBe(0);
	expect(typeof pathChallenge.votedPlayers[player.name]).toBe('undefined');
});
