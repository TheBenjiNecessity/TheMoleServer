import ISocketHandler from '../../interfaces/socket-handler.interface';
import WebSocketService from '../../services/websocket.service';
import OutAndSafeChallengeController from './controller';

class OutAndSafeChallengeSocketHandlerInstance implements ISocketHandler {
	constructor() {}

	releasedButton({ roomcode, playerName }) {
		let message = OutAndSafeChallengeController.getInstance().test(roomcode, playerName);
		return WebSocketService.getInstance().sendToRoom(roomcode, message);
	}

	setupSocket(socket) {
		socket.on('button-released-button', this.releasedButton);
	}
}

export default class OutAndSafeChallengeSocketHandler {
	static instance: OutAndSafeChallengeSocketHandlerInstance;

	constructor() {}

	static getInstance() {
		if (!OutAndSafeChallengeSocketHandler.instance) {
			OutAndSafeChallengeSocketHandler.instance = new OutAndSafeChallengeSocketHandlerInstance();
		}

		return OutAndSafeChallengeSocketHandler.instance;
	}
}
