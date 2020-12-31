import RoomController from '../../controllers/room.controller';
import ChallengeController from '../../controllers/challenge.controller';
import { CHALLENGE_EVENTS } from '../../contants/challenge.constants';
import PlatterChallenge from './model';
import Challenge from '../../models/challenge.model';

const POINTS = 3;

export default class PlatterChallengeController extends ChallengeController {
	constructor(protected roomController: RoomController) {
		super(roomController);
	}

	chooseExemption(roomcode: string, playerName: string) {
		this.performEvent(roomcode, 'takeExemption', playerName);
		this.roomController.giveObjectsToPlayer(roomcode, playerName, 'exemption', 1);
		this.performEvent(roomcode, CHALLENGE_EVENTS.END_CHALLENGE);
		return 'took-exemption';
	}

	chooseMoney(roomcode: string, playerName: string) {
		let room = this.roomController.getRoom(roomcode);
		let platterChallenge = room.currentEpisode.currentChallenge as PlatterChallenge;
		if (!platterChallenge.playerTookMoney(playerName)) {
			room = this.performEvent(roomcode, 'takeMoney', playerName);
			platterChallenge = room.currentEpisode.currentChallenge as PlatterChallenge;
			this.roomController.addPoints(roomcode, POINTS);
			if (platterChallenge.allMoneyWasTaken) {
				this.performEvent(roomcode, CHALLENGE_EVENTS.END_CHALLENGE);
			}
		}

		return 'took-money';
	}

	stateDidChange(roomcode: string, previousState: string, newState: string) {}

	getCurrentChallenge(roomcode: string): PlatterChallenge {
		return this.roomController.getCurrentChallenge(roomcode) as PlatterChallenge;
	}
}
