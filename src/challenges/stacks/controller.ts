import RoomController from '../../controllers/room.controller';
import ChallengeController from '../../controllers/challenge.controller';

export default class StacksChallengeController extends ChallengeController {
	constructor(protected roomController: RoomController) {
		super(roomController);
	}

	test(roomcode, player) {
		return 'test';
	}
}
