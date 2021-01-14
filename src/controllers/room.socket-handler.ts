import WebSocketService from '../services/websocket.service';
import RoomController from './room.controller';
import SocketHandler from '../interfaces/socket-handler';

export default class RoomSocketHandler extends SocketHandler {
	constructor(
		protected roomController: RoomController,
		protected webSocketService: WebSocketService,
		protected socket: any
	) {
		super(roomController, webSocketService, socket);

		socket.on('move-next', this.moveNext.bind(this));
		socket.on('quiz-done', this.quizDone.bind(this));
	}

	/* ===================================== Socket Events ===================================== */
	moveNext({ roomcode }) {
		let message = this.roomController.moveNext(roomcode);
		return this.webSocketService.sendToRoom(this.roomController.getRoom(roomcode));
	}

	// A player has finished their quiz and clicked on the last question
	quizDone({ roomcode, playerName, quizAnswers }) {
		let message = this.roomController.quizDone(roomcode, playerName, quizAnswers);
		return this.webSocketService.sendToRoom(this.roomController.getRoom(roomcode));
	}
}
