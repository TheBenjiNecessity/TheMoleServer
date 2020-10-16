import Room from '../../models/room.model';
import WebSocketService from '../../services/websocket.service';
import RoomController from '../../controllers/room.controller';
import ChallengeController from '../../controllers/challenge.controller';
import ButtonChallengeController from './controller';
import EpisodeSampleService from '../../models/samples/episode.sample';
import RoomSampleService from '../../models/samples/room.sample';
import ButtonChallengeData from './data';
import ButtonChallenge from './model';
import { CHALLENGE_STATES } from '../../contants/challenge.constants';

jest.useFakeTimers();

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

function getMockButtonChallengeController(roomController: RoomController) {
	let challengeController = new ChallengeController(roomController);
	return new ButtonChallengeController(roomController, challengeController);
}

function getMockRoom() {
	let room = RoomSampleService.getTestRoomForNumPlayers(4);
	room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallenge(room, new ButtonChallengeData().getModel(
		room.playersStillPlaying,
		'en'
	) as ButtonChallenge);
	return room;
}

function getMockComponents() {
	let room = getMockRoom();
	let roomController = getMockRoomController();
	let buttonChallengeController = getMockButtonChallengeController(roomController);

	roomController.setRoom(room);

	return { room, roomController, buttonChallengeController };
}

test('Plays through an entire round until all players remove their fingers from the button', () => {
	let { room, roomController, buttonChallengeController } = getMockComponents();
	let { roomcode } = room;
	let currentTick = 1;

	let tickCB = () => {
		if (currentTick === 2) {
			buttonChallengeController.releasedButton(roomcode, room.playersStillPlaying[0].name);
		}

		if (currentTick === 4) {
			buttonChallengeController.touchedButton(roomcode, room.playersStillPlaying[0].name);
			buttonChallengeController.releasedButton(roomcode, room.playersStillPlaying[1].name);
			buttonChallengeController.releasedButton(roomcode, room.playersStillPlaying[2].name);
		}

		if (currentTick === 5) {
			buttonChallengeController.touchedButton(roomcode, room.playersStillPlaying[1].name);
		}

		if (currentTick === 6) {
			buttonChallengeController.releasedButton(roomcode, room.playersStillPlaying[0].name);
			buttonChallengeController.releasedButton(roomcode, room.playersStillPlaying[2].name);
			buttonChallengeController.releasedButton(roomcode, room.playersStillPlaying[1].name);
		}

		if (currentTick === 8) {
			buttonChallengeController.releasedButton(roomcode, room.playersStillPlaying[3].name);
		}

		currentTick++;
	};

	let doneCB = () => {
		// should not be able to get here
		throw new Error('The timer should not be able to complete');
	};

	buttonChallengeController.touchedButton(roomcode, room.playersStillPlaying[0].name, tickCB, doneCB, 1, 10);
	buttonChallengeController.touchedButton(roomcode, room.playersStillPlaying[1].name, tickCB, doneCB, 1, 10);
	buttonChallengeController.touchedButton(roomcode, room.playersStillPlaying[2].name, tickCB, doneCB, 1, 10);
	buttonChallengeController.touchedButton(roomcode, room.playersStillPlaying[3].name, tickCB, doneCB, 1, 10);

	jest.runAllTimers();

	room = roomController.getRoom(roomcode);
	let buttonChallenge = room.currentEpisode.currentChallenge as ButtonChallenge;

	expect(buttonChallenge.state).toBe(CHALLENGE_STATES.CHALLENGE_END);
	for (let player of room.playersStillPlaying) {
		expect(player.numExemptions).toBe(0);
	}

	expect(buttonChallenge.getPointsForTime(1, 1)).toBe(16);
});

test('Plays through an entire round where everyone keeps their fingers on their buttons', () => {
	let { room, roomController, buttonChallengeController } = getMockComponents();
	let { roomcode } = room;

	let tickCB = () => {};
	let doneCB = () => {};

	buttonChallengeController.touchedButton(roomcode, room.playersStillPlaying[0].name, tickCB, doneCB, 1, 10);
	buttonChallengeController.touchedButton(roomcode, room.playersStillPlaying[1].name, tickCB, doneCB, 1, 10);
	buttonChallengeController.touchedButton(roomcode, room.playersStillPlaying[2].name, tickCB, doneCB, 1, 10);
	buttonChallengeController.touchedButton(roomcode, room.playersStillPlaying[3].name, tickCB, doneCB, 1, 10);

	jest.runAllTimers();

	room = roomController.getRoom(roomcode);
	let buttonChallenge = room.currentEpisode.currentChallenge as ButtonChallenge;

	expect(buttonChallenge.state).toBe(CHALLENGE_STATES.CHALLENGE_END);
	for (let player of room.playersStillPlaying) {
		expect(player.numExemptions).toBe(0);
	}

	expect(buttonChallenge.getPointsForTime(1, 1)).toBe(20);
});

test('Plays through an entire round where one person solves the riddle', () => {
	let { room, roomController, buttonChallengeController } = getMockComponents();
	let { roomcode } = room;
	let currentTick = 1;

	(room.currentEpisode.currentChallenge as ButtonChallenge).riddleAnswer = 'test answer';
	roomController.setRoom(room);

	let tickCB = () => {
		if (currentTick === 4) {
			let player2 = room.playersStillPlaying[2];
			buttonChallengeController.releasedButton(roomcode, player2.name);
			buttonChallengeController.receivedPuzzleAnswer(roomcode, player2.name, 'test answer');
		}

		currentTick++;
	};
	let doneCB = () => {
		// should not be able to get here
		throw new Error('The timer should not be able to complete');
	};

	buttonChallengeController.touchedButton(roomcode, room.playersStillPlaying[0].name, tickCB, doneCB, 1, 10);
	buttonChallengeController.touchedButton(roomcode, room.playersStillPlaying[1].name, tickCB, doneCB, 1, 10);
	buttonChallengeController.touchedButton(roomcode, room.playersStillPlaying[2].name, tickCB, doneCB, 1, 10);
	buttonChallengeController.touchedButton(roomcode, room.playersStillPlaying[3].name, tickCB, doneCB, 1, 10);

	jest.runAllTimers();

	room = roomController.getRoom(roomcode);
	let buttonChallenge = room.currentEpisode.currentChallenge as ButtonChallenge;

	expect(buttonChallenge.state).toBe(CHALLENGE_STATES.CHALLENGE_END);

	expect(room.playersStillPlaying[0].numExemptions).toBe(0);
	expect(room.playersStillPlaying[1].numExemptions).toBe(0);
	expect(room.playersStillPlaying[2].numExemptions).toBe(1);
	expect(room.playersStillPlaying[3].numExemptions).toBe(0);

	expect(buttonChallenge.getPointsForTime(1, 1)).toBe(8);
});