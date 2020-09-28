import buttonData from './data';
import RoomSampleService from '../../../tests/room.sample';

test('Checks initializing ButtonChallenge model', () => {
	let room = RoomSampleService.getTestRoomWithFourPlayers();
	let buttonChallenge = buttonData.getModel(room.players, 'en');

	expect(buttonChallenge.riddleAnswer.length === buttonChallenge.riddle.length).toBe(true);
	expect(buttonChallenge.riddleAnswer === buttonChallenge.riddle).toBe(false);
	expect(buttonChallenge.exemptionWasTaken).toBe(false);

	expect(Object.keys(buttonChallenge.buttonPlayers).length).toBe(4);

	for (let player of buttonChallenge.players) {
		let buttonPlayer = buttonChallenge.buttonPlayers[player.name];
		expect(buttonPlayer.touchingButton).toBe(true);
		expect(buttonPlayer.player.name === player.name).toBe(true);
	}
});

test('Checks allButtonsReleased/allButtonsPressed getters', () => {
	let room = RoomSampleService.getTestRoomWithFourPlayers();
	let buttonChallenge = buttonData.getModel(room.players, 'en');

	expect(buttonChallenge.allButtonsReleased).toBe(false);
	expect(buttonChallenge.allButtonsPressed).toBe(true);

	buttonChallenge.setPlayerReleasedButton(room.players[0].name);

	expect(buttonChallenge.allButtonsReleased).toBe(false);
	expect(buttonChallenge.allButtonsPressed).toBe(false);

	buttonChallenge.setPlayerReleasedButton(room.players[1].name);

	expect(buttonChallenge.allButtonsReleased).toBe(false);
	expect(buttonChallenge.allButtonsPressed).toBe(false);

	buttonChallenge.setPlayerReleasedButton(room.players[2].name);

	expect(buttonChallenge.allButtonsReleased).toBe(false);
	expect(buttonChallenge.allButtonsPressed).toBe(false);

	buttonChallenge.setPlayerReleasedButton(room.players[3].name);

	expect(buttonChallenge.allButtonsReleased).toBe(true);
	expect(buttonChallenge.allButtonsPressed).toBe(false);

	buttonChallenge.setPlayerPressedButton(room.players[0].name);

	expect(buttonChallenge.allButtonsReleased).toBe(false);
	expect(buttonChallenge.allButtonsPressed).toBe(false);

	buttonChallenge.setPlayerPressedButton(room.players[1].name);

	expect(buttonChallenge.allButtonsReleased).toBe(false);
	expect(buttonChallenge.allButtonsPressed).toBe(false);

	buttonChallenge.setPlayerPressedButton(room.players[2].name);

	expect(buttonChallenge.allButtonsReleased).toBe(false);
	expect(buttonChallenge.allButtonsPressed).toBe(false);

	buttonChallenge.setPlayerPressedButton(room.players[3].name);

	expect(buttonChallenge.allButtonsReleased).toBe(false);
	expect(buttonChallenge.allButtonsPressed).toBe(true);
});

test('Checks isPlayerAnswerCorrect method', () => {
	let room = RoomSampleService.getTestRoomWithFourPlayers();
	let buttonChallenge = buttonData.getModel(room.players, 'en');

	buttonChallenge.riddleAnswer = 'I am going to stop the mole';
	buttonChallenge.riddle = buttonChallenge.riddleAnswer.randomCypherText();

	expect(buttonChallenge.isPlayerAnswerCorrect('I am going to stop the mole')).toBe(true);
	expect(buttonChallenge.isPlayerAnswerCorrect('i am going to stop the mole')).toBe(true);
	expect(buttonChallenge.isPlayerAnswerCorrect(buttonChallenge.riddleAnswer)).toBe(true);
	expect(buttonChallenge.isPlayerAnswerCorrect('iamgoingtostopthemole')).toBe(false);
	expect(buttonChallenge.isPlayerAnswerCorrect('lasdkfjlaskdfjlsdfkkd')).toBe(false);
	expect(buttonChallenge.isPlayerAnswerCorrect(buttonChallenge.riddle)).toBe(false);
});
