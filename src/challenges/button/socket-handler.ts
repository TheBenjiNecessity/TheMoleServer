import WebSocketService from '../../services/websocket.service';
import ButtonChallengeController from './controller';
import RoomController from '../../controllers/room.controller';
import SocketHandler from '../../interfaces/socket-handler';
import { CHALLENGE_SOCKET_EVENTS } from '../../contants/challenge.constants';

export default class ButtonChallengeSocketHandlerInstance extends SocketHandler {
	constructor(
		protected roomController: RoomController,
		protected webSocketService: WebSocketService,
		protected socket: any,
		private buttonChallengeController: ButtonChallengeController
	) {
		super(roomController, webSocketService, socket);

		socket.on('button-released-button', this.releasedButton);
		socket.on('button-touched-button', this.touchedButton);
		socket.on('button-received-answer', this.receivedPuzzleAnswer);
	}

	releasedButton({ roomcode, playerName }) {
		let message = this.buttonChallengeController.releasedButton(roomcode, playerName);
		return this.webSocketService.sendToRoom(roomcode, message);
	}

	touchedButton({ roomcode, playerName }) {
		let message = this.buttonChallengeController.touchedButton(roomcode, playerName);
		return this.webSocketService.sendToRoom(roomcode, message);
	}

	receivedPuzzleAnswer({ roomcode, playerName, answer }) {
		let message = this.buttonChallengeController.receivedPuzzleAnswer(roomcode, playerName, answer);
		return this.webSocketService.sendToRoom(roomcode, message);
	}

	timerTickCallback(roomcode) {
		return this.webSocketService.sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.TIMER_TICK);
	}

	timerDoneCallback(roomcode) {
		return this.webSocketService.sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.TIMER_OVER);
	}
}
