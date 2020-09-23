import ButtonChallenge from './model';
import buttonData from './data';
import RoomSampleService from '../../tests/room.sample';
import EpisodeSampleService from '../../tests/episode.sample';
import RoomControllerCreator from '../../controllers/room.controller';
import ButtonChallengeController from './controller';

import initExtensions from '../../extensions/main';

initExtensions();

test('Checks releasedButton method', () => {
	let room = RoomSampleService.getTestRoomForNumPlayers(4);
	room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallenge(
		room,
		buttonData.getModel(room.playersStillPlaying, 'en')
	);
	RoomControllerCreator.getInstance().setRoom(room);

	ButtonChallengeController.getInstance().releasedButton({
		roomcode: room.roomcode,
		playerName: room.playersStillPlaying[0].name
	});

	room = RoomControllerCreator.getInstance().getRoom(room.roomcode);
	let buttonChallenge = room.currentEpisode.currentChallenge;

	expect(buttonChallenge.allButtonsReleased).toBe(false);
	expect(buttonChallenge.allButtonsPressed).toBe(false);

	let buttonPlayer = buttonChallenge.buttonPlayers[room.playersStillPlaying[0].name];
	expect(buttonPlayer !== null && typeof buttonPlayer !== 'undefined').toBe(true);
	expect(buttonPlayer.touchingButton).toBe(false);

	let numPlayersTouchingButton = buttonChallenge.players.filter(
		(p) => buttonChallenge.buttonPlayers[p.name].touchingButton
	).length;
	expect(numPlayersTouchingButton).toBe(3);

	ButtonChallengeController.getInstance().releasedButton({
		roomcode: room.roomcode,
		playerName: room.playersStillPlaying[1].name
	});

	room = RoomControllerCreator.getInstance().getRoom(room.roomcode);
	numPlayersTouchingButton = buttonChallenge.players.filter(
		(p) => buttonChallenge.buttonPlayers[p.name].touchingButton
	).length;
	expect(numPlayersTouchingButton).toBe(2);

	ButtonChallengeController.getInstance().releasedButton({
		roomcode: room.roomcode,
		playerName: room.playersStillPlaying[2].name
	});

	room = RoomControllerCreator.getInstance().getRoom(room.roomcode);
	numPlayersTouchingButton = buttonChallenge.players.filter(
		(p) => buttonChallenge.buttonPlayers[p.name].touchingButton
	).length;
	expect(numPlayersTouchingButton).toBe(1);

	ButtonChallengeController.getInstance().releasedButton({
		roomcode: room.roomcode,
		playerName: room.playersStillPlaying[3].name
	});

	room = RoomControllerCreator.getInstance().getRoom(room.roomcode);
	numPlayersTouchingButton = buttonChallenge.players.filter(
		(p) => buttonChallenge.buttonPlayers[p.name].touchingButton
	).length;
	expect(numPlayersTouchingButton).toBe(0);
	expect(buttonChallenge.allButtonsReleased).toBe(true);
	expect(buttonChallenge.allButtonsPressed).toBe(false);

	expect(buttonChallenge.state).toBe('end');
});

test('Checks touchedButton method', () => {
	let room = RoomSampleService.getTestRoomForNumPlayers(4);
	room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallenge(
		room,
		buttonData.getModel(room.playersStillPlaying, 'en')
	);
	RoomControllerCreator.getInstance().setRoom(room);

	let instance = ButtonChallengeController.getInstance();
	instance.touchedButton({ roomcode: room.roomcode, playerName: room.playersStillPlaying[0].name });

	room = RoomControllerCreator.getInstance().getRoom(room.roomcode);
	let buttonChallenge = room.currentEpisode.currentChallenge;

	expect(buttonChallenge.allButtonsReleased).toBe(false);
	expect(buttonChallenge.allButtonsPressed).toBe(true);

	let buttonPlayer = buttonChallenge.buttonPlayers[room.playersStillPlaying[0].name];
	expect(buttonPlayer !== null || typeof buttonPlayer !== 'undefined').toBe(true);
	expect(buttonPlayer.touchingButton).toBe(true);

	instance.touchedButton({ roomcode: room.roomcode, playerName: room.playersStillPlaying[1].name });
	instance.touchedButton({ roomcode: room.roomcode, playerName: room.playersStillPlaying[2].name });
	instance.touchedButton({ roomcode: room.roomcode, playerName: room.playersStillPlaying[3].name });
	room = RoomControllerCreator.getInstance().getRoom(room.roomcode);
	buttonChallenge = room.currentEpisode.currentChallenge;

	expect(buttonChallenge.allButtonsReleased).toBe(true);
	expect(buttonChallenge.allButtonsPressed).toBe(false);
});

test('Checks receivedPuzzleAnswer method (correct answer)', () => {
	let room = RoomSampleService.getTestRoomForNumPlayers(4);
	room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallenge(
		room,
		buttonData.getModel(room.playersStillPlaying, 'en')
	);
	room.currentEpisode.currentChallenge.riddleAnswer = 'I am going to stop the mole';
	room.currentEpisode.currentChallenge.riddle = room.currentEpisode.currentChallenge.riddleAnswer.randomCypherText();
	RoomControllerCreator.getInstance().setRoom(room);

	let instance = ButtonChallengeController.getInstance();
	instance.receivedPuzzleAnswer({
		roomcode: room.roomcode,
		playerName: room.playersStillPlaying[0].name,
		answer: 'I am going to stop the mole'
	});

	room = RoomControllerCreator.getInstance().getRoom(room.roomcode);
	let buttonChallenge = room.currentEpisode.currentChallenge;

	expect(room.playersStillPlaying[0].objects.exemption).toBe(1);
	expect(room.playersStillPlaying[1].objects.exemption).toBe(0);
	expect(room.playersStillPlaying[2].objects.exemption).toBe(0);
	expect(room.playersStillPlaying[3].objects.exemption).toBe(0);
	expect(buttonChallenge.state).toBe('end');
});

test('Checks receivedPuzzleAnswer method (incorrect answer)', () => {
	let room = RoomSampleService.getTestRoomForNumPlayers(4);
	room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallenge(
		room,
		buttonData.getModel(room.playersStillPlaying, 'en')
	);
	room.currentEpisode.currentChallenge.riddleAnswer = 'I am going to stop the mole';
	room.currentEpisode.currentChallenge.riddle = room.currentEpisode.currentChallenge.riddleAnswer.randomCypherText();
	RoomControllerCreator.getInstance().setRoom(room);

	let instance = ButtonChallengeController.getInstance();
	instance.receivedPuzzleAnswer({
		roomcode: room.roomcode,
		playerName: room.playersStillPlaying[0].name,
		answer: 'blah blah blah blah'
	});

	room = RoomControllerCreator.getInstance().getRoom(room.roomcode);
	let buttonChallenge = room.currentEpisode.currentChallenge;

	expect(room.playersStillPlaying[0].objects.exemption).toBe(0);
	expect(room.playersStillPlaying[1].objects.exemption).toBe(0);
	expect(room.playersStillPlaying[2].objects.exemption).toBe(0);
	expect(room.playersStillPlaying[3].objects.exemption).toBe(0);
	expect(buttonChallenge.state).toBe('game');
});
