import RoomControllerCreator from '../../controllers/room.controller';
import Controller from '../../interfaces/controller';
import RoomController from '../../controllers/room.controller';
import ChallengeController from '../../controllers/challenge.controller';
import { CHALLENGE_EVENTS } from '../../contants/challenge.constants';
import PlatterChallenge from './model';

const POINTS = 3;

export default class PlatterChallengeController extends Controller {
	constructor(protected roomController: RoomController, protected challengeController: ChallengeController) {
		super(roomController);
	}

	chooseExemption(roomcode: string, playerName: string) {
		this.roomController.performEventOnChallenge(roomcode, 'takeExemption', playerName);
		this.roomController.giveObjectsToPlayer(roomcode, playerName, 'exemption', 1);
		this.roomController.performEventOnChallenge(roomcode, CHALLENGE_EVENTS.END_CHALLENGE);
		return 'took-exemption';
	}

	chooseMoney(roomcode: string, playerName: string) {
		let room = this.roomController.getRoom(roomcode);
		let platterChallenge = room.currentEpisode.currentChallenge as PlatterChallenge;
		if (!platterChallenge.playerTookMoney(playerName)) {
			room = this.roomController.performEventOnChallenge(roomcode, 'takeMoney', playerName);
			platterChallenge = room.currentEpisode.currentChallenge as PlatterChallenge;
			this.roomController.addPoints(roomcode, POINTS);
			if (platterChallenge.allMoneyWasTaken) {
				this.roomController.performEventOnChallenge(roomcode, CHALLENGE_EVENTS.END_CHALLENGE);
			}
		}

		return 'took-money';
	}
}
