import ButtonChallenge from './model';
import RoomSampleService from '../../models/samples/room.sample';
import EpisodeSampleService from '../../models/samples/episode.sample';
import RoomController from '../../controllers/room.controller';
import ButtonChallengeController from './controller';
import ButtonChallengeData from './data';
import { getMockRoomController } from '../../models/samples/room-controller.sample';

const SAMPLE_RIDDLE_ANSWER = 'I am going to stop the mole';

function getMockButtonChallengeController(roomController: RoomController) {
	return new ButtonChallengeController(roomController);
}

function getMockRoom() {
	let room = RoomSampleService.getTestRoomForNumPlayers(4);
	let buttonChallengeData = new ButtonChallengeData();
	buttonChallengeData.initModel(room.playersStillPlaying, 'en');
	const buttonChallenge = buttonChallengeData.model as ButtonChallenge;
	buttonChallenge.riddleAnswer = SAMPLE_RIDDLE_ANSWER;
	buttonChallenge.riddle = buttonChallenge.riddleAnswer.randomCypherText();
	buttonChallengeData.model = buttonChallenge;
	room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallenge(room, buttonChallengeData);
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
	let { roomcode } = room;

	buttonChallengeController.releasedButton(roomcode, room.playersStillPlaying[0].name);

	let buttonChallenge = roomController.getCurrentChallenge(roomcode) as ButtonChallenge;

	expect(buttonChallenge.allButtonsReleased).toBe(false);
	expect(buttonChallenge.allButtonsPressed).toBe(false);

	let buttonPlayer = buttonChallenge.buttonPlayers[room.playersStillPlaying[0].name];
	expect(buttonPlayer !== null && typeof buttonPlayer !== 'undefined').toBe(true);
	expect(buttonPlayer.touchingButton).toBe(false);

	let numPlayersTouchingButton = buttonChallenge.players.filter(
		(p) => buttonChallenge.buttonPlayers[p.name].touchingButton
	).length;
	expect(numPlayersTouchingButton).toBe(3);

	buttonChallengeController.releasedButton(roomcode, room.playersStillPlaying[1].name);
	buttonChallenge = roomController.getCurrentChallenge(roomcode) as ButtonChallenge;

	numPlayersTouchingButton = buttonChallenge.players.filter(
		(p) => buttonChallenge.buttonPlayers[p.name].touchingButton
	).length;
	expect(numPlayersTouchingButton).toBe(2);

	buttonChallengeController.releasedButton(roomcode, room.playersStillPlaying[2].name);
	buttonChallenge = roomController.getCurrentChallenge(roomcode) as ButtonChallenge;

	numPlayersTouchingButton = buttonChallenge.players.filter(
		(p) => buttonChallenge.buttonPlayers[p.name].touchingButton
	).length;
	expect(numPlayersTouchingButton).toBe(1);

	buttonChallengeController.releasedButton(roomcode, room.playersStillPlaying[3].name);
	buttonChallenge = roomController.getCurrentChallenge(roomcode) as ButtonChallenge;

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

	buttonChallengeController.touchedButton(room.roomcode, room.playersStillPlaying[0].name, 1, 10);

	room = roomController.getRoom(room.roomcode);
	let buttonChallenge = room.currentEpisode.currentChallenge as ButtonChallenge;

	expect(buttonChallenge.allButtonsReleased).toBe(false);
	expect(buttonChallenge.allButtonsPressed).toBe(true);

	let buttonPlayer = buttonChallenge.buttonPlayers[room.playersStillPlaying[0].name];
	expect(buttonPlayer !== null || typeof buttonPlayer !== 'undefined').toBe(true);
	expect(buttonPlayer.touchingButton).toBe(true);

	buttonChallengeController.touchedButton(room.roomcode, room.playersStillPlaying[1].name, 1, 10);
	buttonChallengeController.touchedButton(room.roomcode, room.playersStillPlaying[2].name, 1, 10);
	buttonChallengeController.touchedButton(room.roomcode, room.playersStillPlaying[3].name, 1, 10);

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
