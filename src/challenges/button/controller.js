import RoomController from '../../controllers/room.controller';
import ChallengeController from '../../controllers/challenge.controller';

class ButtonChallengeControllerInstance {
	constructor(roomControllerInstance, challengeControllerInstance) {
		this.roomControllerInstance = roomControllerInstance;
		this.challengeControllerInstance = challengeControllerInstance;
	}

	releasedButton(roomcode, playerName) {
		let event = 'setPlayerReleasedButton';
		let message = 'button-player-released';
		let room = this.roomControllerInstance().performEventOnChallenge(roomcode, event, playerName);
		let buttonChallenge = room.currentEpisode.currentChallenge;

		// If all buttons are released then the game is over
		if (buttonChallenge.allButtonsReleased) {
			this.roomControllerInstance().performEventOnChallenge(roomcode, 'endChallenge');
			message = 'challenge-end';
		}

		return message;
	}

	touchedButton(roomcode, playerName, timerLength = 600000) {
		let message = 'button-player-pressed';
		let event = 'setPlayerPressedButton';
		let room = this.roomControllerInstance().performEventOnChallenge(roomcode, event, playerName);
		let buttonChallenge = room.currentEpisode.currentChallenge;

		// If it is the start of the game and everyone touches their button then the game begins
		if (buttonChallenge.allButtonsPressed && !buttonChallenge.isChallengeRunning) {
			this.challengeControllerInstance().startTimer(roomcode, timerLength);
			message = 'challenge-start';
		}

		return message;
	}

	receivedPuzzleAnswer(roomcode, playerName, answer) {
		let room = this.roomControllerInstance().getRoom(roomcode);
		let message = 'button-player-answered';
		let buttonChallenge = room.currentEpisode.currentChallenge;

		if (buttonChallenge.isPlayerAnswerCorrect(answer)) {
			this.roomControllerInstance().giveObjectsToPlayer(roomcode, playerName, 'exemption', 1);
			this.roomControllerInstance().performEventOnChallenge(roomcode, 'endChallenge');
			message = 'challenge-end';
		}

		return message;
	}
}

export default class ButtonChallengeController {
	constructor() {}

	static getInstance() {
		if (!ButtonChallengeController.instance) {
			ButtonChallengeController.instance = new ButtonChallengeControllerInstance(
				RoomController.getInstance(),
				ChallengeController.getInstance()
			);
		}

		return ButtonChallengeController.instance;
	}
}
