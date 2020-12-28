import RoomController from '../../controllers/room.controller';
import ChallengeController from '../../controllers/challenge.controller';
import Challenge from '../../models/challenge.model';

export default class StacksChallengeController extends ChallengeController {
	constructor(protected roomController: RoomController) {
		super(roomController);
	}

	test(roomcode, player) {
		return 'test';
	}

	stateDidChange(roomcode: string, previousState: string, newState: string) {}

	getCurrentChallenge(roomcode: string): Challenge {
		throw new Error('Method not implemented.');
	}
}
