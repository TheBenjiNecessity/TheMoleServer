import ChallengeController from '../controllers/challenge.controller';
import WebSocketServiceCreator from '../services/websocket.service';

class RoomSocketHandlerInstance {
	constructor(roomServiceInstance, websocketServiceInstance, challengeControllerInstance) {
		this.roomServiceInstance = roomServiceInstance;
		this.websocketServiceInstance = websocketServiceInstance;
		this.challengeControllerInstance = challengeControllerInstance;
	}

	/* ===================================== Socket Events ===================================== */
	moveNext({ roomcode }) {
		let message = this.roomServiceInstance().moveNext(roomcode);
		return this.websocketServiceInstance().sendToRoom(roomcode, message);
	}

	// A player has finished their quiz and clicked on the last question
	quizDone({ roomcode, playerName, quizAnswers }) {
		let message = this.roomServiceInstance().quizDone(roomcode, playerName, quizAnswers);
		return this.websocketServiceInstance().sendToRoom(roomcode, message);
	}

	setupSocket(socket) {
		socket.on('move-next', this.moveNext);
		socket.on('quiz-done', this.quizDone);

		this.challengeControllerInstance().setupSocket(socket);
	}
}

export default class RoomSocketHandler {
	constructor() {}

	static getInstance() {
		if (!RoomSocketHandler.instance) {
			RoomSocketHandler.instance = new RoomSocketHandlerInstance(
				() => RoomSocketHandler.getInstance(),
				() => WebSocketServiceCreator.getInstance(),
				() => ChallengeController.getInstance()
			);
		}
		return RoomSocketHandler.instance;
	}
}
