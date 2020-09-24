import RoomControllerCreator from '../../controllers/room.controller';
import WebSocketServiceCreator from '../../services/websocket.service';
import ChallengeController from '../../controllers/challenge.controller';
import ButtonChallengeController from './controller';

class ButtonChallengeSocketHandlerInstance {
	constructor() {}

	releasedButton({ roomcode, playerName }) {
		let { roomcode, message } = ButtonChallengeController.releasedButton(roomcode, playerName);
		let room = RoomControllerCreator.getInstance().getInstance();

		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, message, room);
	}

	touchedButton({ roomcode, playerName }) {
		let { roomcode, message } = ButtonChallengeController.touchedButton(roomcode, playerName);
		let room = RoomControllerCreator.getInstance().getInstance();

		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, message, room);
	}

	receivedPuzzleAnswer({ roomcode, playerName, answer }) {
		let { roomcode, message } = ButtonChallengeController.receivedPuzzleAnswer(roomcode, playerName, answer);
		let room = RoomControllerCreator.getInstance().getInstance();

		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, message, room);
	}

	setupSocket(socket) {
		socket.on('button-released-button', this.releasedButton);
		socket.on('button-touched-button', this.touchedButton);
		socket.on('button-received-answer', this.receivedPuzzleAnswer);
	}
}

export default class ButtonChallengeSocketHandler {
	constructor() {}

	static getInstance() {
		if (!ButtonChallengeSocketHandler.instance) {
			ButtonChallengeSocketHandler.instance = new ButtonChallengeSocketHandlerInstance();
		}

		return ButtonChallengeSocketHandler.instance;
	}
}
