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

		socket.on('select-card', this.selectCard);
	}

	selectCard({ roomcode, playerName, card }) {
		let message = this.outAndSafeChallengeController.selectCard(roomcode, playerName, card);
		return this.webSocketService.sendToRoom(this.roomController.getRoom(roomcode));
	}
}
