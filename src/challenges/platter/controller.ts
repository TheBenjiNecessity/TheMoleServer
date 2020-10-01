import RoomControllerCreator from '../../controllers/room.controller';
import Controller from '../../interfaces/controller';
import RoomController from '../../controllers/room.controller';
import ChallengeController from '../../controllers/challenge.controller';

export default class PlatterChallengeController extends Controller {
	constructor(protected roomController: RoomController, protected challengeController: ChallengeController) {
		super(roomController);
	}

	chooseExemption(roomcode, player) {
		let event = 'take-exemption';
		this.roomController.performEventOnChallenge(roomcode, event);
		this.roomController.giveObjectsToPlayer(roomcode, player, 'exemption', 1);
		return 'took-exemption';
	}

	chooseMoney(roomcode) {
		let event = 'take-money';
		this.roomController.performEventOnChallenge(roomcode, event);
		return 'took-money';
	}
}
