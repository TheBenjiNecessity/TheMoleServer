import WebSocketService from '../../services/websocket.service';
import TradersChallengeController from './controller';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';

export default class TradersChallengeSocketHandler extends SocketHandler {
	constructor(
		protected roomController: RoomController,
		protected webSocketService: WebSocketService,
		protected socket: any,
		private stacksChallengeController: TradersChallengeController
	) {
		super(roomController, webSocketService, socket);

		socket.on('test', this.test);
	}

	test({ roomcode, playerName }) {
		let message = this.stacksChallengeController.test(roomcode, playerName);
		return this.webSocketService.sendToRoom(this.roomController.getRoom(roomcode));
	}
}
