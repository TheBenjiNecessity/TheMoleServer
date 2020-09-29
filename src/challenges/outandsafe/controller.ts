import RoomControllerCreator from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';

class OutAndSafeChallengeControllerInstance {
	constructor() {}

	test(roomcode, player) {
		return 'test';
	}
}

export default class OutAndSafeChallengeController {
	static instance: OutAndSafeChallengeControllerInstance;
	constructor() {}

	static getInstance() {
		if (!OutAndSafeChallengeController.instance) {
			OutAndSafeChallengeController.instance = new OutAndSafeChallengeControllerInstance();
		}

		return OutAndSafeChallengeController.instance;
	}
}
