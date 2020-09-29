import RoomControllerCreator from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';

class StacksChallengeControllerInstance {
	constructor() {}

	test(roomcode, player) {
		return 'test';
	}
}

export default class StacksChallengeController {
	static instance: StacksChallengeControllerInstance;
	constructor() {}

	static getInstance() {
		if (!StacksChallengeController.instance) {
			StacksChallengeController.instance = new StacksChallengeControllerInstance();
		}

		return StacksChallengeController.instance;
	}
}
