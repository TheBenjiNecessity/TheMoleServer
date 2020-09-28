import ISocketHandler from '../../interfaces/socket-handler.interface';
import WebSocketService from '../../services/websocket.service';
import PathChallengeController from './controller';

class PathChallengeSocketHandlerInstance implements ISocketHandler {
	constructor() {}

	chooseChest({ roomcode, choice }) {
		let message = PathChallengeController.getInstance().chooseChest(roomcode, choice);
		return WebSocketService.getInstance().sendToRoom(roomcode, message);
	}

	addVoteForChest({ roomcode, player, choice }) {
		let message = PathChallengeController.getInstance().addVoteForChest(roomcode, player, choice);
		return WebSocketService.getInstance().sendToRoom(roomcode, message);
	}

	setupSocket(socket) {
		socket.on('path-choose-chest', this.chooseChest);
		socket.on('path-add-vote-chest', this.addVoteForChest);
	}
}

export default class PathChallengeSocketHandler {
	static instance: PathChallengeSocketHandlerInstance;

	constructor() {}

	static getInstance() {
		if (!PathChallengeSocketHandler.instance) {
			PathChallengeSocketHandler.instance = new PathChallengeSocketHandlerInstance();
		}

		return PathChallengeSocketHandler.instance;
	}
}
