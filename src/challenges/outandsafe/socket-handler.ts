import WebSocketService from '../../services/websocket.service';
import OutAndSafeChallengeController from './controller';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';

export default class OutAndSafeChallengeSocketHandler extends SocketHandler {
	constructor(
		protected roomController: RoomController,
		protected webSocketService: WebSocketService,
		protected socket: any,
		private outAndSafeChallengeController: OutAndSafeChallengeController
	) {
		super(roomController, webSocketService, socket);

		socket.on('test', this.test);
	}

	test({ roomcode, playerName }) {
		let message = this.outAndSafeChallengeController.test(roomcode, playerName);
		return this.webSocketService.sendToRoom(roomcode, message);
	}
}
