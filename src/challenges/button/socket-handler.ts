import ISocketHandler from '../../interfaces/socket-handler.interface';
import WebSocketService from '../../services/websocket.service';
import ButtonChallengeController from './controller';

class ButtonChallengeSocketHandlerInstance implements ISocketHandler {
	constructor() {}

	releasedButton({ roomcode, playerName }) {
		let message = ButtonChallengeController.getInstance().releasedButton(roomcode, playerName);
		return WebSocketService.getInstance().sendToRoom(roomcode, message);
	}

	touchedButton({ roomcode, playerName }) {
		let message = ButtonChallengeController.getInstance().touchedButton(roomcode, playerName);
		return WebSocketService.getInstance().sendToRoom(roomcode, message);
	}

	receivedPuzzleAnswer({ roomcode, playerName, answer }) {
		let message = ButtonChallengeController.getInstance().receivedPuzzleAnswer(roomcode, playerName, answer);
		return WebSocketService.getInstance().sendToRoom(roomcode, message);
	}

	setupSocket(socket) {
		socket.on('button-released-button', this.releasedButton);
		socket.on('button-touched-button', this.touchedButton);
		socket.on('button-received-answer', this.receivedPuzzleAnswer);
	}
}

export default class ButtonChallengeSocketHandler {
	static instance: ButtonChallengeSocketHandlerInstance;

	constructor() {}

	static getInstance() {
		if (!ButtonChallengeSocketHandler.instance) {
			ButtonChallengeSocketHandler.instance = new ButtonChallengeSocketHandlerInstance();
		}

		return ButtonChallengeSocketHandler.instance;
	}
}
