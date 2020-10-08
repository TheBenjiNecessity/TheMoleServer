import RoomController from '../../controllers/room.controller';
import ChallengeController from '../../controllers/challenge.controller';
import { CHALLENGE_EVENTS } from '../../contants/challenge.constants';
import Controller from '../../interfaces/controller';

export default class ButtonChallengeController extends Controller {
	constructor(protected roomController: RoomController, protected challengeController: ChallengeController) {
		super(roomController);
	}

	releasedButton(roomcode, playerName) {
		let event = 'setPlayerReleasedButton';
		let message = 'button-player-released';
		let room = this.roomController.performEventOnChallenge(roomcode, event, playerName);
		let buttonChallenge = room.currentEpisode.currentChallenge;

		// If all buttons are released then the game is over
		if (buttonChallenge.allButtonsReleased) {
			this.roomController.performEventOnChallenge(roomcode, CHALLENGE_EVENTS.END_CHALLENGE);
			message = 'challenge-end';
		}

		return message;
	}

	touchedButton(
		roomcode,
		playerName,
		timerTickCallback = (roomcode: string) => {},
		timerDoneCallback = (roomcode: string) => {},
		interval = 1000,
		timerLength = 600000
	) {
		let message = 'button-player-pressed';
		let event = 'setPlayerPressedButton';
		let room = this.roomController.performEventOnChallenge(roomcode, event, playerName);
		let buttonChallenge = room.currentEpisode.currentChallenge;

		// If it is the start of the game and everyone touches their button then the game begins
		if (buttonChallenge.allButtonsPressed && !buttonChallenge.isChallengeRunning) {
			this.challengeController.startTimer(roomcode, timerLength, interval, timerTickCallback, timerDoneCallback);
			message = 'challenge-start';
		}

		return message;
	}

	receivedPuzzleAnswer(roomcode, playerName, answer) {
		let room = this.roomController.getRoom(roomcode);
		let message = 'button-player-answered';
		let buttonChallenge = room.currentEpisode.currentChallenge;

		if (buttonChallenge.isPlayerAnswerCorrect(answer)) {
			this.roomController.giveObjectsToPlayer(roomcode, playerName, 'exemption', 1);
			this.roomController.performEventOnChallenge(roomcode, CHALLENGE_EVENTS.END_CHALLENGE);
			message = 'challenge-end';
		}

		return message;
	}
}
