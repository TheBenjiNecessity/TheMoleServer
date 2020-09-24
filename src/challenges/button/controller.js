import RoomController from '../../controllers/room.controller';
import WebSocketServiceCreator from '../../services/websocket.service';
import ChallengeController from '../../controllers/challenge.controller';

class ButtonChallengeControllerInstance {
	constructor() {}

	static releasedButton(roomcode, playerName) {
		let event = 'setPlayerReleasedButton';
		let message = 'button-player-released';
		let room = RoomController.getInstance().performEventOnChallenge(roomcode, event, playerName);
		let buttonChallenge = room.currentEpisode.currentChallenge;

		// If all buttons are released then the game is over
		if (buttonChallenge.allButtonsReleased) {
			RoomController.getInstance().performEventOnChallenge(roomcode, 'endChallenge');
			message = 'challenge-end';
		}

		return message;
	}

	static touchedButton(roomcode, playerName, timerLength = 600000) {
		let event = 'setPlayerPressedButton';
		let message = 'button-player-pressed';
		let room = RoomController.getInstance().performEventOnChallenge(roomcode, event, playerName);
		let buttonChallenge = room.currentEpisode.currentChallenge;

		// If it is the start of the game and everyone touches their button then the game begins
		if (buttonChallenge.allButtonsPressed && !buttonChallenge.isChallengeRunning) {
			ChallengeController.getInstance().startTimer(roomcode, timerLength);
			message = 'challenge-start';
		}

		return message;
	}

	static receivedPuzzleAnswer(roomcode, playerName, answer) {
		let room = RoomController.getInstance().getRoom(roomcode);
		let message = 'button-player-answered';
		let buttonChallenge = room.currentEpisode.currentChallenge;

		if (buttonChallenge.isPlayerAnswerCorrect(answer)) {
			RoomController.getInstance().giveObjectsToPlayer(roomcode, playerName, 'exemption', 1);
			RoomController.getInstance().performEventOnChallenge(roomcode, 'endChallenge', {});
			message = 'challenge-end';
		}

		return message;
	}
}

export default class ButtonChallengeController {
	constructor() {}

	static getInstance() {
		if (!ButtonChallengeController.instance) {
			ButtonChallengeController.instance = new ButtonChallengeControllerInstance();
		}

		return ButtonChallengeController.instance;
	}
}
