import ButtonChallenge from './model';
import RoomSampleService from '../../models/samples/room.sample';
import EpisodeSampleService from '../../models/samples/episode.sample';
import RoomController from '../../controllers/room.controller';
import ButtonChallengeController from './controller';
import ButtonChallengeData from './data';
import Room from '../../models/room.model';
import WebSocketService from '../../services/websocket.service';
import ChallengeController from '../../controllers/challenge.controller';

const SAMPLE_RIDDLE_ANSWER = 'I am going to stop the mole';

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
	let buttonChallenge = new ButtonChallengeData().getModel(room.playersStillPlaying, 'en') as ButtonChallenge;
	buttonChallenge.riddleAnswer = SAMPLE_RIDDLE_ANSWER;
	buttonChallenge.riddle = buttonChallenge.riddleAnswer.randomCypherText();
	room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallenge(room, buttonChallenge);
	return room;
}

function getMockComponents() {
	let room = getMockRoom();
	let roomController = getMockRoomController();
	let buttonChallengeController = getMockButtonChallengeController(roomController);

	roomController.setRoom(room);

	return { room, roomController, buttonChallengeController };
}

test('Checks releasedButton method', () => {
	let { room, roomController, buttonChallengeController } = getMockComponents();

	buttonChallengeController.releasedButton(room.roomcode, room.playersStillPlaying[0].name);

	room = roomController.getRoom(room.roomcode);
	let buttonChallenge = room.currentEpisode.currentChallenge as ButtonChallenge;

	expect(buttonChallenge.allButtonsReleased).toBe(false);
	expect(buttonChallenge.allButtonsPressed).toBe(false);

	let buttonPlayer = buttonChallenge.buttonPlayers[room.playersStillPlaying[0].name];
	expect(buttonPlayer !== null && typeof buttonPlayer !== 'undefined').toBe(true);
	expect(buttonPlayer.touchingButton).toBe(false);

	let numPlayersTouchingButton = buttonChallenge.players.filter(
		(p) => buttonChallenge.buttonPlayers[p.name].touchingButton
	).length;
	expect(numPlayersTouchingButton).toBe(3);

	buttonChallengeController.releasedButton(room.roomcode, room.playersStillPlaying[1].name);

	room = roomController.getRoom(room.roomcode);
	numPlayersTouchingButton = buttonChallenge.players.filter(
		(p) => buttonChallenge.buttonPlayers[p.name].touchingButton
	).length;
	expect(numPlayersTouchingButton).toBe(2);

	buttonChallengeController.releasedButton(room.roomcode, room.playersStillPlaying[2].name);

	room = roomController.getRoom(room.roomcode);
	numPlayersTouchingButton = buttonChallenge.players.filter(
		(p) => buttonChallenge.buttonPlayers[p.name].touchingButton
	).length;
	expect(numPlayersTouchingButton).toBe(1);

	buttonChallengeController.releasedButton(room.roomcode, room.playersStillPlaying[3].name);

	room = roomController.getRoom(room.roomcode);
	numPlayersTouchingButton = buttonChallenge.players.filter(
		(p) => buttonChallenge.buttonPlayers[p.name].touchingButton
	).length;
	expect(numPlayersTouchingButton).toBe(0);
	expect(buttonChallenge.allButtonsReleased).toBe(true);
	expect(buttonChallenge.allButtonsPressed).toBe(false);

	expect(buttonChallenge.state).toBe('end');
});

test('Checks touchedButton method', () => {
	let { room, roomController, buttonChallengeController } = getMockComponents();

	const mockTickCallback = (roomcode: string) => {};
	const mockDoneCallback = (roomcode: string) => {};
	buttonChallengeController.touchedButton(
		room.roomcode,
		room.playersStillPlaying[0].name,
		mockTickCallback,
		mockDoneCallback,
		1,
		10
	);

	room = roomController.getRoom(room.roomcode);
	let buttonChallenge = room.currentEpisode.currentChallenge as ButtonChallenge;

	expect(buttonChallenge.allButtonsReleased).toBe(false);
	expect(buttonChallenge.allButtonsPressed).toBe(true);

	let buttonPlayer = buttonChallenge.buttonPlayers[room.playersStillPlaying[0].name];
	expect(buttonPlayer !== null || typeof buttonPlayer !== 'undefined').toBe(true);
	expect(buttonPlayer.touchingButton).toBe(true);

	buttonChallengeController.touchedButton(
		room.roomcode,
		room.playersStillPlaying[1].name,
		mockTickCallback,
		mockDoneCallback,
		1,
		10
	);
	buttonChallengeController.touchedButton(
		room.roomcode,
		room.playersStillPlaying[2].name,
		mockTickCallback,
		mockDoneCallback,
		1,
		10
	);
	buttonChallengeController.touchedButton(
		room.roomcode,
		room.playersStillPlaying[3].name,
		mockTickCallback,
		mockDoneCallback,
		1,
		10
	);

	room = roomController.getRoom(room.roomcode);
	buttonChallenge = room.currentEpisode.currentChallenge as ButtonChallenge;

	expect(buttonChallenge.allButtonsReleased).toBe(false);
	expect(buttonChallenge.allButtonsPressed).toBe(true);
});

test('Checks receivedPuzzleAnswer method (correct answer)', () => {
	let { room, roomController, buttonChallengeController } = getMockComponents();
	let buttonChallenge = room.currentEpisode.currentChallenge as ButtonChallenge;

	buttonChallengeController.receivedPuzzleAnswer(
		room.roomcode,
		room.playersStillPlaying[0].name,
		SAMPLE_RIDDLE_ANSWER
	);

	room = roomController.getRoom(room.roomcode);
	buttonChallenge = room.currentEpisode.currentChallenge as ButtonChallenge;

	expect(room.playersStillPlaying[0].objects.exemption).toBe(1);
	expect(room.playersStillPlaying[1].objects.exemption).toBe(0);
	expect(room.playersStillPlaying[2].objects.exemption).toBe(0);
	expect(room.playersStillPlaying[3].objects.exemption).toBe(0);
	expect(buttonChallenge.state).toBe('end');
});

test('Checks receivedPuzzleAnswer method (incorrect answer)', () => {
	let { room, roomController, buttonChallengeController } = getMockComponents();

	buttonChallengeController.receivedPuzzleAnswer(
		room.roomcode,
		room.playersStillPlaying[0].name,
		'blah blah blah blah'
	);

	room = roomController.getRoom(room.roomcode);
	let buttonChallenge = room.currentEpisode.currentChallenge as ButtonChallenge;

	expect(room.playersStillPlaying[0].objects.exemption).toBe(0);
	expect(room.playersStillPlaying[1].objects.exemption).toBe(0);
	expect(room.playersStillPlaying[2].objects.exemption).toBe(0);
	expect(room.playersStillPlaying[3].objects.exemption).toBe(0);
	expect(buttonChallenge.state).toBe('game');
});
