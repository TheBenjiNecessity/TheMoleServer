import WebSocketService from '../../services/websocket.service';
import StacksChallengeController from './controller';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';

export default class StacksChallengeSocketHandler extends SocketHandler {
	constructor(
		protected roomController: RoomController,
		protected webSocketService: WebSocketService,
		protected socket: any,
		private stacksChallengeController: StacksChallengeController
	) {
		super(roomController, webSocketService, socket);

		socket.on('test', this.test);
	}

	test({ roomcode, playerName }) {
		let message = this.stacksChallengeController.test(roomcode, playerName);
		return this.webSocketService.sendToRoom(roomcode, message);
	}

	setupSocket(socket) {
		socket.on('test', this.test);
	}
}
