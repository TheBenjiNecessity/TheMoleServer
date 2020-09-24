import ButtonChallenge from './model';
import buttonData from './data';
import RoomSampleService from '../../tests/room.sample';
import EpisodeSampleService from '../../tests/episode.sample';
import RoomController from '../../controllers/room.controller';
import ButtonChallengeController from './controller';

import initExtensions from '../../extensions/main';

initExtensions();

test('Checks releasedButton method', () => {
	let room = RoomSampleService.getTestRoomForNumPlayers(4);
	room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallenge(
		room,
		buttonData.getModel(room.playersStillPlaying, 'en')
	);
	RoomController.getInstance().setRoom(room);

	ButtonChallengeController.releasedButton({
		roomcode: room.roomcode,
		playerName: room.playersStillPlaying[0].name
	});

	room = RoomController.getInstance().getRoom(room.roomcode);
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

	ButtonChallengeController.releasedButton({
		roomcode: room.roomcode,
		playerName: room.playersStillPlaying[1].name
	});

	room = RoomController.getInstance().getRoom(room.roomcode);
	numPlayersTouchingButton = buttonChallenge.players.filter(
		(p) => buttonChallenge.buttonPlayers[p.name].touchingButton
	).length;
	expect(numPlayersTouchingButton).toBe(2);

	ButtonChallengeController.releasedButton({
		roomcode: room.roomcode,
		playerName: room.playersStillPlaying[2].name
	});

	room = RoomController.getInstance().getRoom(room.roomcode);
	numPlayersTouchingButton = buttonChallenge.players.filter(
		(p) => buttonChallenge.buttonPlayers[p.name].touchingButton
	).length;
	expect(numPlayersTouchingButton).toBe(1);

	ButtonChallengeController.releasedButton({
		roomcode: room.roomcode,
		playerName: room.playersStillPlaying[3].name
	});

	room = RoomController.getInstance().getRoom(room.roomcode);
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
	RoomController.getInstance().setRoom(room);

	ButtonChallengeController.touchedButton({ roomcode: room.roomcode, playerName: room.playersStillPlaying[0].name });

	room = RoomController.getInstance().getRoom(room.roomcode);
	let buttonChallenge = room.currentEpisode.currentChallenge;

	expect(buttonChallenge.allButtonsReleased).toBe(false);
	expect(buttonChallenge.allButtonsPressed).toBe(true);

	let buttonPlayer = buttonChallenge.buttonPlayers[room.playersStillPlaying[0].name];
	expect(buttonPlayer !== null || typeof buttonPlayer !== 'undefined').toBe(true);
	expect(buttonPlayer.touchingButton).toBe(true);

	ButtonChallengeController.touchedButton({ roomcode: room.roomcode, playerName: room.playersStillPlaying[1].name });
	ButtonChallengeController.touchedButton({ roomcode: room.roomcode, playerName: room.playersStillPlaying[2].name });
	ButtonChallengeController.touchedButton({ roomcode: room.roomcode, playerName: room.playersStillPlaying[3].name });
	room = RoomController.getInstance().getRoom(room.roomcode);
	buttonChallenge = room.currentEpisode.currentChallenge;

	expect(buttonChallenge.allButtonsReleased).toBe(false);
	expect(buttonChallenge.allButtonsPressed).toBe(true);
});

test('Checks receivedPuzzleAnswer method (correct answer)', () => {
	let room = RoomSampleService.getTestRoomForNumPlayers(4);
	room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallenge(
		room,
		buttonData.getModel(room.playersStillPlaying, 'en')
	);
	room.currentEpisode.currentChallenge.riddleAnswer = 'I am going to stop the mole';
	room.currentEpisode.currentChallenge.riddle = room.currentEpisode.currentChallenge.riddleAnswer.randomCypherText();
	RoomController.getInstance().setRoom(room);

	ButtonChallengeController.receivedPuzzleAnswer({
		roomcode: room.roomcode,
		playerName: room.playersStillPlaying[0].name,
		answer: 'I am going to stop the mole'
	});

	room = RoomController.getInstance().getRoom(room.roomcode);
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
	RoomController.getInstance().setRoom(room);

	ButtonChallengeController.receivedPuzzleAnswer({
		roomcode: room.roomcode,
		playerName: room.playersStillPlaying[0].name,
		answer: 'blah blah blah blah'
	});

	room = RoomController.getInstance().getRoom(room.roomcode);
	let buttonChallenge = room.currentEpisode.currentChallenge;

	expect(room.playersStillPlaying[0].objects.exemption).toBe(0);
	expect(room.playersStillPlaying[1].objects.exemption).toBe(0);
	expect(room.playersStillPlaying[2].objects.exemption).toBe(0);
	expect(room.playersStillPlaying[3].objects.exemption).toBe(0);
	expect(buttonChallenge.state).toBe('game');
});
