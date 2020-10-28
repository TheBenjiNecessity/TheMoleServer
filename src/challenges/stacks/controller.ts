import RoomController from '../../controllers/room.controller';
import ChallengeController from '../../controllers/challenge.controller';
import StacksChallenge from './model';
import { CHALLENGE_EVENTS } from '../../contants/challenge.constants';

export default class StacksChallengeController extends ChallengeController {
	constructor(protected roomController: RoomController) {
		super(roomController);
	}

	selectAmount(roomcode: string, playerName: string, numSelected: number) {
		let event = 'selectNumberOfTilesForPlayer';
		let message = 'stacks-player-selected';
		let room = this.performEvent(roomcode, event, playerName, numSelected);
		let stacksChallenge = room.currentEpisode.currentChallenge as StacksChallenge;

		if (stacksChallenge.allStackAmountsSelected) {
			let { pointsForRound } = stacksChallenge;
			if (pointsForRound > 0) {
				this.roomController.addPoints(roomcode, pointsForRound);
			} else {
				this.roomController.removePoints(roomcode, pointsForRound);
			}

			room = this.performEvent(roomcode, 'goToNextRound');
			stacksChallenge = room.currentEpisode.currentChallenge as StacksChallenge;

			if (stacksChallenge.isChallengeOver) {
				this.performEvent(roomcode, CHALLENGE_EVENTS.END_CHALLENGE);
				message = 'challenge-end';
			}
		}

		return message;
	}
}
