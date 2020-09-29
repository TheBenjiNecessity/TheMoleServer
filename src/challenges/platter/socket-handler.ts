import ISocketHandler from '../../interfaces/socket-handler.interface';
import WebSocketService from '../../services/websocket.service';
import PlatterChallengeController from './controller';

class PlatterChallengeSocketHandlerInstance implements ISocketHandler {
	constructor() {}

	chooseExemption({ roomcode, playerName }) {
		let message = PlatterChallengeController.getInstance().chooseExemption(roomcode, playerName);
		return WebSocketService.getInstance().sendToRoom(roomcode, message);
	}

	chooseMoney({ roomcode }) {
		let message = PlatterChallengeController.getInstance().chooseMoney(roomcode);
		return WebSocketService.getInstance().sendToRoom(roomcode, message);
	}

	setupSocket(socket) {
		socket.on('platter-choose-exemption', this.chooseExemption);
		socket.on('platter-choose-money', this.chooseMoney);
	}
}

export default class PlatterChallengeSocketHandler {
	static instance: PlatterChallengeSocketHandlerInstance;

	constructor() {}

	static getInstance() {
		if (!PlatterChallengeSocketHandler.instance) {
			PlatterChallengeSocketHandler.instance = new PlatterChallengeSocketHandlerInstance();
		}

		return PlatterChallengeSocketHandler.instance;
	}
}
