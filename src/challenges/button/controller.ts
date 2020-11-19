import RoomController from '../../controllers/room.controller';
import ChallengeController from '../../controllers/challenge.controller';
import { CHALLENGE_EVENTS } from '../../contants/challenge.constants';
import ButtonChallenge from './model';

export default class ButtonChallengeController extends ChallengeController {
	constructor(protected roomController: RoomController) {
		super(roomController);
	}

	releasedButton(roomcode: string, playerName: string) {
		let event = 'setPlayerReleasedButton';
		let message = 'button-player-released';
		let room = this.performEvent(roomcode, event, playerName);
		let buttonChallenge = room.currentEpisode.currentChallenge as ButtonChallenge;

		// If all buttons are released then the game is over
		if (buttonChallenge.allButtonsReleased) {
			this.performEvent(roomcode, CHALLENGE_EVENTS.END_CHALLENGE);
			message = 'challenge-end';
		}

		return message;
	}

	touchedButton(
		roomcode: string,
		playerName: string,
		interval: number = 1000,
		timerLength: number = 600000,
		tickCB: Function = () => {},
		doneCB: Function = () => {}
	) {
		let message = 'button-player-pressed';
		let event = 'setPlayerPressedButton';
		let room = this.performEvent(roomcode, event, playerName);
		let buttonChallenge = room.currentEpisode.currentChallenge as ButtonChallenge;

		// If it is the start of the game and everyone touches their button then the game begins
		if (buttonChallenge.allButtonsPressed && !buttonChallenge.isChallengeRunning) {
			this.startTimer(roomcode, timerLength, interval, tickCB, () => {
				doneCB();
				this.roomController.endChallenge(roomcode);
			});
			message = 'challenge-start';
		}

		return message;
	}

	receivedPuzzleAnswer(roomcode: string, playerName: string, answer: string) {
		let room = this.roomController.getRoom(roomcode);
		let message = 'button-player-answered';
		let buttonChallenge = room.currentEpisode.currentChallenge as ButtonChallenge;

		if (buttonChallenge.isPlayerAnswerCorrect(answer)) {
			this.roomController.giveObjectsToPlayer(roomcode, playerName, 'exemption', 1);
			this.performEvent(roomcode, CHALLENGE_EVENTS.END_CHALLENGE);
			message = 'challenge-end';
		}

		return message;
	}
}
