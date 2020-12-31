import RoomController from '../../controllers/room.controller';
import ChallengeController from '../../controllers/challenge.controller';
import { CHALLENGE_EVENTS } from '../../contants/challenge.constants';
import WiseMonkeysChallenge from './model';
import Challenge from '../../models/challenge.model';

const POINTS = 10;

export default class WiseMonkeysChallengeController extends ChallengeController {
	constructor(protected roomController: RoomController) {
		super(roomController);
	}

	enterRiddleAnswer(roomcode: string, playerName: string, answerText: string) {
		let room = this.roomController.getRoom(roomcode);
		let wiseMonkeysChallenge = this.getCurrentChallenge(roomcode); //room.currentEpisode.currentChallenge as WiseMonkeysChallenge;

		if (wiseMonkeysChallenge.isAnswerCorrect(answerText, room.language)) {
			room = this.performEvent(roomcode, 'goToNextRiddle');
			wiseMonkeysChallenge = room.currentEpisode.currentChallenge as WiseMonkeysChallenge;
			if (wiseMonkeysChallenge.challengeIsOver) {
				this.roomController.addPoints(roomcode, POINTS);
				this.roomController.endChallenge(roomcode);
				return 'wisemonkeys-challenge-over';
			} else {
				return 'wisemonkeys-move-next';
			}
		}

		return 'wisemonkeys-entered-riddle';
	}

	stateDidChange(roomcode: string, previousState: string, newState: string) {
		if (newState === Challenge.CHALLENGE_STATES.IN_GAME) {
			this.roomController.startTimer(roomcode, 1000 * 60 * 5, 1000);
		}
	}

	getCurrentChallenge(roomcode: string): WiseMonkeysChallenge {
		return this.roomController.getCurrentChallenge(roomcode) as WiseMonkeysChallenge;
	}
}
