import RoomController from '../../controllers/room.controller';
import ChallengeController from '../../controllers/challenge.controller';
import OutAndSafeChallenge from './model';
import { CHALLENGE_EVENTS } from '../../contants/challenge.constants';
import Challenge from '../../models/challenge.model';

const POINTS = 10;

export default class OutAndSafeChallengeController extends ChallengeController {
	constructor(protected roomController: RoomController) {
		super(roomController);
	}

	selectCard(roomcode: string, playerName: string, card: string) {
		let event = 'selectCard';
		let room = this.performEvent(roomcode, event, playerName, card);
		let outAndSafeChallenge = room.currentEpisode.currentChallenge as OutAndSafeChallenge;

		if (outAndSafeChallenge.allCardsPlayed) {
			if (outAndSafeChallenge.numOutCards === 1) {
				this.roomController.addPoints(roomcode, POINTS);
				this.performEvent(roomcode, CHALLENGE_EVENTS.END_CHALLENGE);
				return 'challenge-end';
			} else if (outAndSafeChallenge.numOutCards > 1) {
				this.performEvent(roomcode, CHALLENGE_EVENTS.END_CHALLENGE);
				return 'challenge-end';
			} else {
				room = this.performEvent(roomcode, 'increaseRoundNumber');
				return 'out-safe-all-safe';
			}
		}

		return 'out-safe-card-selected';
	}

	stateDidChange(roomcode: string, previousState: string, newState: string) {}

	getCurrentChallenge(roomcode: string): Challenge {
		throw new Error('Method not implemented.');
	}
}
