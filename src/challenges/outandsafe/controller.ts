import RoomControllerCreator from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';
import Controller from '../../interfaces/controller';
import RoomController from '../../controllers/room.controller';
import ChallengeController from '../../controllers/challenge.controller';
import OutAndSafeChallenge from './model';
import { CHALLENGE_EVENTS } from '../../contants/challenge.constants';

const POINTS = 10;

export default class OutAndSafeChallengeController extends Controller {
	constructor(protected roomController: RoomController, protected challengeController: ChallengeController) {
		super(roomController);
	}

	selectCard(roomcode: string, playerName: string, card: string) {
		let event = 'selectCard';
		let room = this.roomController.performEventOnChallenge(roomcode, event, playerName, card);
		let outAndSafeChallenge = room.currentEpisode.currentChallenge as OutAndSafeChallenge;

		if (outAndSafeChallenge.allCardsPlayed) {
			if (outAndSafeChallenge.numOutCards === 1) {
				this.roomController.addPoints(roomcode, POINTS);
				this.roomController.performEventOnChallenge(roomcode, CHALLENGE_EVENTS.END_CHALLENGE);
				return 'challenge-end';
			} else if (outAndSafeChallenge.numOutCards > 1) {
				this.roomController.performEventOnChallenge(roomcode, CHALLENGE_EVENTS.END_CHALLENGE);
				return 'challenge-end';
			} else {
				room = this.roomController.performEventOnChallenge(roomcode, 'increaseRoundNumber');
				return 'out-safe-all-safe';
			}
		}

		return 'out-safe-card-selected';
	}
}
