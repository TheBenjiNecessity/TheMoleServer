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

		socket.on('button-released-button', this.releasedButton.bind(this));
		socket.on('button-touched-button', this.touchedButton.bind(this));
		socket.on('button-received-answer', this.receivedPuzzleAnswer.bind(this));
	}

	releasedButton({ roomcode, playerName }) {
		let message = this.buttonChallengeController.releasedButton(roomcode, playerName);
		return this.webSocketService.sendToRoom(this.roomController.getRoom(roomcode));
	}

	touchedButton({ roomcode, playerName }) {
		let message = this.buttonChallengeController.touchedButton(roomcode, playerName);
		return this.webSocketService.sendToRoom(this.roomController.getRoom(roomcode));
	}

	receivedPuzzleAnswer({ roomcode, playerName, answer }) {
		let message = this.buttonChallengeController.receivedPuzzleAnswer(roomcode, playerName, answer);
		return this.webSocketService.sendToRoom(this.roomController.getRoom(roomcode));
	}

	timerTickCallback(roomcode) {
		return this.webSocketService.sendToRoom(
			this.roomController.getRoom(roomcode),
			CHALLENGE_SOCKET_EVENTS.TIMER_TICK
		);
	}

	timerDoneCallback(roomcode) {
		return this.webSocketService.sendToRoom(
			this.roomController.getRoom(roomcode),
			CHALLENGE_SOCKET_EVENTS.TIMER_OVER
		);
	}
}
