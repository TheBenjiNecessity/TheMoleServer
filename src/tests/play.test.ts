import ChallengeController from '../controllers/challenge.controller';
import RoomController from '../controllers/room.controller';
import Challenge from '../models/challenge.model';
import Player from '../models/player.model';
import Room from '../models/room.model';
import ChallengeSampleService from '../models/samples/challenge.sample';
import { getMockRoomController } from '../models/samples/room-controller.sample';

jest.useFakeTimers();

function getMockChallengeController(roomController: RoomController) {
	return new ChallengeController(roomController);
}

function getMockComponents() {
	let challengeData = [];
	for (let i = 0; i < 30; i++) {
		challengeData.push(ChallengeSampleService.getTestChallengeData());
	}

	let roomController = getMockRoomController(challengeData);
	let challengeController = getMockChallengeController(roomController);

	return { roomController, challengeController };
}

test('Plays through the entire game', () => {
	let { roomController, challengeController } = getMockComponents();
	let room = roomController.addRoom('en');
	let { roomcode } = room;

	roomController.setChallengeDataForRoom(roomcode);

	roomController.addPlayerToRoom(roomcode, new Player('test1'));
	roomController.addPlayerToRoom(roomcode, new Player('test2'));
	roomController.addPlayerToRoom(roomcode, new Player('test3'));
	roomController.addPlayerToRoom(roomcode, new Player('test4'));
	roomController.addPlayerToRoom(roomcode, new Player('test5'));
	roomController.addPlayerToRoom(roomcode, new Player('test6'));
	roomController.addPlayerToRoom(roomcode, new Player('test7'));
	roomController.addPlayerToRoom(roomcode, new Player('test8'));
	roomController.addPlayerToRoom(roomcode, new Player('test9'));
	roomController.addPlayerToRoom(roomcode, new Player('test10'));

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.LOBBY);

	roomController.moveNext(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.WELCOME);
	expect(roomController.getRoom(roomcode).playersStillPlaying.find((p) => p.isMole)).toBeTruthy();
	expect(roomController.getRoom(roomcode).playersStillPlaying.length).toBe(10);

	roomController.moveNext(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.EPISODE_START);
	expect(roomController.getRoom(roomcode).currentEpisode).toBeTruthy();

	roomController.moveNext(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.IN_CHALLENGE);
	let { currentChallenge } = roomController.getRoom(roomcode).currentEpisode;
	expect(currentChallenge.state).toBe(Challenge.CHALLENGE_STATES.ROLE_SELECTION);

	let players = roomController.getRoom(roomcode).playersStillPlaying;
	challengeController.raiseHand(roomcode, players[0].name, currentChallenge.roles[0].name);
	challengeController.raiseHand(roomcode, players[1].name, currentChallenge.roles[0].name);
	challengeController.raiseHand(roomcode, players[2].name, currentChallenge.roles[0].name);
	challengeController.raiseHand(roomcode, players[3].name, currentChallenge.roles[0].name);
	challengeController.raiseHand(roomcode, players[4].name, currentChallenge.roles[0].name);
	challengeController.raiseHand(roomcode, players[5].name, currentChallenge.roles[1].name);
	challengeController.raiseHand(roomcode, players[6].name, currentChallenge.roles[1].name);
	challengeController.raiseHand(roomcode, players[7].name, currentChallenge.roles[1].name);
	challengeController.raiseHand(roomcode, players[8].name, currentChallenge.roles[1].name);
	challengeController.raiseHand(roomcode, players[9].name, currentChallenge.roles[1].name);

	challengeController.agreeToRoles(roomcode, players[0].name);
	challengeController.agreeToRoles(roomcode, players[1].name);
	challengeController.agreeToRoles(roomcode, players[2].name);
	challengeController.agreeToRoles(roomcode, players[3].name);
	challengeController.agreeToRoles(roomcode, players[4].name);

	currentChallenge = roomController.getRoom(roomcode).currentEpisode.currentChallenge;
	expect(currentChallenge.state).toBe(Challenge.CHALLENGE_STATES.IN_GAME);
});
