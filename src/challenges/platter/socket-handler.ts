import WebSocketService from '../../services/websocket.service';
import PlatterChallengeController from './controller';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';

export default class PlatterChallengeSocketHandlerInstance extends SocketHandler {
	constructor(
		protected roomController: RoomController,
		protected webSocketService: WebSocketService,
		protected socket: any,
		private platterChallengeController: PlatterChallengeController
	) {
		super(roomController, webSocketService, socket);

		socket.on('platter-choose-exemption', this.chooseExemption);
		socket.on('platter-choose-money', this.chooseMoney);
	}

	chooseExemption({ roomcode, playerName }) {
		let message = this.platterChallengeController.chooseExemption(roomcode, playerName);
		return this.webSocketService.sendToRoom(this.roomController.getRoom(roomcode));
	}

	chooseMoney({ roomcode, playerName }) {
		let message = this.platterChallengeController.chooseMoney(roomcode, playerName);
		return this.webSocketService.sendToRoom(this.roomController.getRoom(roomcode));
	}
}
