import RoomControllerCreator from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';
import Controller from '../../interfaces/controller';
import RoomController from '../../controllers/room.controller';
import ChallengeController from '../../controllers/challenge.controller';

export default class OutAndSafeChallengeController extends Controller {
	constructor(protected roomController: RoomController, protected challengeController: ChallengeController) {
		super(roomController);
	}

	test(roomcode, player) {
		return 'test';
	}
}
