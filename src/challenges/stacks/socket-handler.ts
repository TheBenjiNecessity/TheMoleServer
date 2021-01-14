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

		socket.on('stacks-select-amount', this.selectAmount);
	}

	selectAmount({ roomcode, playerName, numSelected }) {
		let message = this.stacksChallengeController.selectAmount(roomcode, playerName, numSelected);
		return this.webSocketService.sendToRoom(this.roomController.getRoom(roomcode));
	}
}
