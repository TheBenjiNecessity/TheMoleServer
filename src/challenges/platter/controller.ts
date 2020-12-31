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
		this.roomController.endChallenge(roomcode);
		return 'took-exemption';
	}

	chooseMoney(roomcode: string, playerName: string) {
		let room = this.roomController.getRoom(roomcode);
		let platterChallenge = this.getCurrentChallenge(roomcode);
		if (!platterChallenge.playerTookMoney(playerName)) {
			room = this.performEvent(roomcode, 'takeMoney', playerName);
			platterChallenge = this.getCurrentChallenge(roomcode);
			this.roomController.addPoints(roomcode, POINTS);
			if (platterChallenge.allMoneyWasTaken) {
				this.roomController.endChallenge(roomcode);
			}
		}

		return 'took-money';
	}

	stateDidChange(roomcode: string, previousState: string, newState: string) {}

	getCurrentChallenge(roomcode: string): PlatterChallenge {
		return this.roomController.getCurrentChallenge(roomcode) as PlatterChallenge;
	}
}
