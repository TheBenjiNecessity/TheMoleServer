import WebSocketService from '../services/websocket.service';
import RoomController from './room.controller';
import SocketHandler from '../interfaces/socket-handler';
import { createLog } from '../services/logger.service';

export default class RoomSocketHandler extends SocketHandler {
	constructor(
		protected roomController: RoomController,
		protected webSocketService: WebSocketService,
		protected socket: any
	) {
		super(roomController, webSocketService, socket);

		socket.on('move-next', this.moveNext.bind(this));
		socket.on('agree-to-move-next', this.agreeToMoveNext.bind(this));
		socket.on('quiz-done', this.quizDone.bind(this));
	}

	/* ===================================== Socket Events ===================================== */
	moveNext({ roomcode }) {
		let message = this.roomController.moveNext(roomcode);
		createLog(roomcode, `func: moveNext - ${message}`);
		return this.webSocketService.sendToRoom(this.roomController.getRoom(roomcode));
	}

	agreeToMoveNext({ roomcode, playerName }) {
		let message = this.roomController.addAgreeToMoveNextPlayer(roomcode, playerName);
		createLog(roomcode, `func: agree to move next - ${message}`);
		return this.webSocketService.sendToRoom(this.roomController.getRoom(roomcode));
	}

	// A player has finished their quiz and clicked on the last question
	quizDone({ roomcode, playerName, quizAnswers }) {
		let message = this.roomController.quizDone(roomcode, playerName, quizAnswers);
		createLog(roomcode, `func: quizDone - ${message}`);
		return this.webSocketService.sendToRoom(this.roomController.getRoom(roomcode));
	}
}
