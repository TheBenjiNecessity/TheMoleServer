import ButtonChallenge from './model';
import * as buttonData from './data';
import RoomSampleService from '../../tests/room.sample';
import arrayExtensions from '../../extensions/array';
import stringExtensions from '../../extensions/string';
import EpisodeSampleService from '../../tests/episode.sample';
import RoomControllerCreator from '../../controllers/room.controller';
import ButtonChallengeController from '../outandsafe/controller';

arrayExtensions();
stringExtensions();

test('Checks releasedButton method', () => {
	let room = RoomSampleService.getTestRoomWithFourPlayers();
	room.currentEpisode = EpisodeSampleService.getTestEpisode(room);
	room.currentEpisode.currentChallenge = buttonData.getModel(room.playersStillPlaying, 'en');
	RoomControllerCreator.getInstance().setRoom(room);

	let instance = ButtonChallengeController.getInstance();
	instance.releasedButton({ roomcode: room.roomcode, playerName: room.playersStillPlaying[0].name });

	room = RoomControllerCreator.getInstance().getRoom(room.roomcode);
	let buttonChallenge = room.currentEpisode.currentChallenge;

	expect(buttonChallenge.allButtonsReleased).toBe(false);
	expect(buttonChallenge.allButtonsPressed).toBe(false);

	let buttonPlayer = buttonChallenge.buttonPlayers.find((bp) => bp.player.name === room.playersStillPlaying[0].name);
	expect(buttonPlayer !== null || typeof buttonPlayer !== 'undefined').toBe(true);
	expect(buttonPlayer.touchingButton).toBe(true);
});

test('Checks touchedButton method', () => {
	let room = RoomSampleService.getTestRoomWithFourPlayers();
	room.currentEpisode = EpisodeSampleService.getTestEpisode(room);
	room.currentEpisode.currentChallenge = buttonData.getModel(room.playersStillPlaying, 'en');
	RoomControllerCreator.getInstance().setRoom(room);

	let instance = ButtonChallengeController.getInstance();
	instance.touchedButton({ roomcode: room.roomcode, playerName: room.playersStillPlaying[0].name });

	room = RoomControllerCreator.getInstance().getRoom(room.roomcode);
	let buttonChallenge = room.currentEpisode.currentChallenge;

	expect(buttonChallenge.allButtonsReleased).toBe(false);
	expect(buttonChallenge.allButtonsPressed).toBe(true);

	let buttonPlayer = buttonChallenge.buttonPlayers.find((bp) => bp.player.name === room.playersStillPlaying[0].name);
	expect(buttonPlayer !== null || typeof buttonPlayer !== 'undefined').toBe(true);
	expect(buttonPlayer.touchingButton).toBe(true);
});

test('Checks receivedPuzzleAnswer method', () => {
	let room = RoomSampleService.getTestRoomWithFourPlayers();
	room.currentEpisode = EpisodeSampleService.getTestEpisode(room);
	room.currentEpisode.currentChallenge = buttonData.getModel(room.playersStillPlaying, 'en');
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

	expect(buttonChallenge.allButtonsReleased).toBe(false); //TODO
});
