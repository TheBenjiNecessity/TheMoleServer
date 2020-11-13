import RoomController from '../../controllers/room.controller';
import ChallengeController from '../../controllers/challenge.controller';
import { CHALLENGE_EVENTS } from '../../contants/challenge.constants';
import WiseMonkeysChallenge from './model';

const POINTS = 10;

export default class WiseMonkeysChallengeController extends ChallengeController {
	constructor(protected roomController: RoomController) {
		super(roomController);
	}

	enterRiddleAnswer(roomcode: string, playerName: string, answerText: string) {
		let room = this.roomController.getRoom(roomcode);
		let wiseMonkeysChallenge = room.currentEpisode.currentChallenge as WiseMonkeysChallenge;

		if (wiseMonkeysChallenge.isAnswerCorrect(answerText, room.language)) {
			room = this.performEvent(roomcode, 'goToNextRiddle');
			wiseMonkeysChallenge = room.currentEpisode.currentChallenge as WiseMonkeysChallenge;
			if (wiseMonkeysChallenge.challengeIsOver) {
				this.roomController.addPoints(roomcode, POINTS);
				this.performEvent(roomcode, CHALLENGE_EVENTS.END_CHALLENGE);
				return 'wisemonkeys-challenge-over';
			} else {
				return 'wisemonkeys-move-next';
			}
		}

		return 'entered-riddle';
	}
}
