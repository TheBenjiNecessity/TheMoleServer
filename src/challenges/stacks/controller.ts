import Controller from '../../interfaces/controller';
import RoomController from '../../controllers/room.controller';
import ChallengeController from '../../controllers/challenge.controller';

export default class StacksChallengeController extends Controller {
	constructor(protected roomController: RoomController, protected challengeController: ChallengeController) {
		super(roomController);
	}

	test(roomcode, player) {
		return 'test';
	}
}
