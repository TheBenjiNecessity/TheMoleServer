import ChallengeController from '../controllers/challenge.controller';
import RoomSampleService from '../models/samples/room.sample';
import EpisodeSampleService from '../models/samples/episode.sample';
import RoomController from '../controllers/room.controller';
import Room from '../models/room.model';
import WebSocketService from '../services/websocket.service';
import Challenge from '../models/challenge.model';
import ButtonChallengeController from '../challenges/button/controller';

let rooms: { [id: string]: Room } = {};

function getMockRoomController() {
	rooms = {};
	let webSocketService = new WebSocketService(null);
	return new RoomController(
		webSocketService,
		[],
		() => rooms,
		(r) => {
			rooms = r;
		}
	);
}

function getMockRoom(numPlayers) {
	let room = RoomSampleService.getTestRoomForNumPlayers(numPlayers);
	room.currentEpisode = EpisodeSampleService.getTestEpisode(room);
	return room;
}

function getMockComponents(numPlayers) {
	let room = getMockRoom(numPlayers);
	let roomController = getMockRoomController();
	let challengeController = new ButtonChallengeController(roomController);

	roomController.setRoom(room);

	return { room, roomController, challengeController };
}

test.skip('Checks "raiseHand" method', () => {
	//TODO: need to create role based challenge for this too work
	let { room, roomController, challengeController } = getMockComponents(10);
	let { roomcode } = room;
	room.currentEpisode = EpisodeSampleService.getTestEpisode(room);

	let player = room.playersStillPlaying[0];

	challengeController.raiseHand(roomcode, player.name, 'test');
	let pathChallenge = roomController.getRoom(roomcode).currentEpisode.currentChallenge;

	expect(pathChallenge.raisedHands.length).toBe(1);
	expect(pathChallenge.raisedHands[0].roleName).toBe('test');
	expect(pathChallenge.raisedHands[0].playerName).toBe('test1');

	challengeController.raiseHand(roomcode, player.name, 'test2');
	pathChallenge = roomController.getRoom(roomcode).currentEpisode.currentChallenge;

	expect(pathChallenge.raisedHands.length).toBe(1);
	expect(pathChallenge.raisedHands[0].roleName).toBe('test2');
	expect(pathChallenge.raisedHands[0].playerName).toBe('test1');
});

test.skip('Checks "agreeToRoles" method', () => {
	let { room, roomController, challengeController } = getMockComponents(10);
	let { roomcode } = room;
	let player = room.playersStillPlaying[0];

	room.currentEpisode = EpisodeSampleService.getTestEpisode(room);

	challengeController.agreeToRoles(roomcode, player.name);
	let pathChallenge = roomController.getRoom(roomcode).currentEpisode.currentChallenge;

	expect(pathChallenge.agreedPlayerNames.length).toBe(1);
	expect(pathChallenge.agreedPlayerNames[0]).toBe('test1');

	challengeController.agreeToRoles(roomcode, player.name);
	pathChallenge = roomController.getRoom(roomcode).currentEpisode.currentChallenge;

	expect(pathChallenge.agreedPlayerNames.length).toBe(1);
	expect(pathChallenge.agreedPlayerNames[0]).toBe('test1');
});

test('Checks "addPlayerVote" method', () => {
	let { room, roomController, challengeController } = getMockComponents(10);
	let { roomcode } = room;
	let player = room.playersStillPlaying[0];

	room.currentEpisode = EpisodeSampleService.getTestEpisode(room);
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

	room.currentEpisode = EpisodeSampleService.getTestEpisode(room);
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
