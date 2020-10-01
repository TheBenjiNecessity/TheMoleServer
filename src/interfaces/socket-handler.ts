import RoomController from '../controllers/room.controller';
import WebSocketService from '../services/websocket.service';

export default class SocketHandler {
	constructor(
		protected roomController: RoomController,
		protected webSocketService: WebSocketService,
		protected socket: any
	) {}
}
