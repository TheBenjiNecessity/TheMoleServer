import WebSocketService from '../../services/websocket.service';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';
import WiseMonkeysChallengeController from './controller';

export default class WiseMonkeysChallengeSocketHandlerInstance extends SocketHandler {
	constructor(
		protected roomController: RoomController,
		protected webSocketService: WebSocketService,
		protected socket: any,
		private wiseMonkeysChallengeController: WiseMonkeysChallengeController
	) {
		super(roomController, webSocketService, socket);

		socket.on('wisemonkeys-enter-riddle', this.enterRiddleAnswer);
	}

	enterRiddleAnswer({ roomcode, playerName, answerText }) {
		let message = this.wiseMonkeysChallengeController.enterRiddleAnswer(roomcode, playerName, answerText);
		return this.webSocketService.sendToRoom(roomcode, message);
	}
}