import ChallengeController from './challenge.controller';
import WebSocketService from '../services/websocket.service';
import ISocketHandler from '../interfaces/socket-handler.interface';

class RoomSocketHandlerInstance implements ISocketHandler {
	websocketServiceInstance: Function;
	roomSocketInstance: Function;
	challengeControllerInstance: Function;

	constructor(roomSocketInstance, websocketServiceInstance, challengeControllerInstance) {
		this.roomSocketInstance = roomSocketInstance;
		this.websocketServiceInstance = websocketServiceInstance;
		this.challengeControllerInstance = challengeControllerInstance;
	}

	/* ===================================== Socket Events ===================================== */
	moveNext({ roomcode }) {
		let message = this.roomSocketInstance().moveNext(roomcode);
		return this.websocketServiceInstance().sendToRoom(roomcode, message);
	}

	// A player has finished their quiz and clicked on the last question
	quizDone({ roomcode, playerName, quizAnswers }) {
		let message = this.roomSocketInstance().quizDone(roomcode, playerName, quizAnswers);
		return this.websocketServiceInstance().sendToRoom(roomcode, message);
	}

	setupSocket(socket) {
		socket.on('move-next', this.moveNext);
		socket.on('quiz-done', this.quizDone);
	}
}

export default class RoomSocketHandler {
	static instance: RoomSocketHandlerInstance;
	constructor() {}

	static getInstance() {
		if (!RoomSocketHandler.instance) {
			RoomSocketHandler.instance = new RoomSocketHandlerInstance(
				() => RoomSocketHandler.getInstance(),
				() => WebSocketService.getInstance(),
				() => ChallengeController.getInstance()
			);
		}
		return RoomSocketHandler.instance;
	}
}
