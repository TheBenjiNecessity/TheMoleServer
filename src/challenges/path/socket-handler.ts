import WebSocketService from '../../services/websocket.service';
import PathChallengeController from './controller';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';

export default class PathChallengeSocketHandlerInstance extends SocketHandler {
	constructor(
		protected roomController: RoomController,
		protected webSocketService: WebSocketService,
		protected socket: any,
		private pathChallengeController: PathChallengeController
	) {
		super(roomController, webSocketService, socket);

		socket.on('path-choose-chest', this.chooseChest);
		socket.on('path-add-vote-chest', this.addVoteForChest);
	}

	chooseChest({ roomcode, choice }) {
		let message = this.pathChallengeController.chooseChest(roomcode, choice);
		return this.webSocketService.sendToRoom(this.roomController.getRoom(roomcode));
	}

	addVoteForChest({ roomcode, player, choice }) {
		let message = this.pathChallengeController.addVoteForChest(roomcode, player, choice);
		return this.webSocketService.sendToRoom(this.roomController.getRoom(roomcode));
	}
}
