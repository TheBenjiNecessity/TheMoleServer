import RoomControllerCreator from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';
import StacksChallengeController from './controller';

class StacksChallengeSocketHandlerInstance {
	constructor() {}

	test({ roomcode, playerName }) {
		let message = StacksChallengeController.getInstance().test(roomcode, playerName);
		return WebSocketService.getInstance().sendToRoom(roomcode, message);
	}

	setupSocket(socket) {
		socket.on('test', this.test);
	}
}

export default class StacksChallengeSocketHandler {
	static instance: StacksChallengeSocketHandlerInstance;
	constructor() {}

	static getInstance() {
		if (!StacksChallengeSocketHandler.instance) {
			StacksChallengeSocketHandler.instance = new StacksChallengeSocketHandlerInstance();
		}

		return StacksChallengeSocketHandler.instance;
	}
}
