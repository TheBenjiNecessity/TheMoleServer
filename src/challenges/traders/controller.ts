import RoomController from '../../controllers/room.controller';
import ChallengeController from '../../controllers/challenge.controller';
import StacksChallenge from '../stacks/model';

export default class StacksChallengeController extends ChallengeController {
	constructor(protected roomController: RoomController) {
		super(roomController);
	}

	test(roomcode, player) {
		return 'test';
	}

	stateDidChange(roomcode: string, previousState: string, newState: string) {}

	getCurrentChallenge(roomcode: string): StacksChallenge {
		return this.roomController.getCurrentChallenge(roomcode) as StacksChallenge;
	}
}
