import RoomController from './room.controller';
import WebSocketService from '../services/websocket.service';
import SocketHandler from '../interfaces/socket-handler';
import ChallengeController from './challenge.controller';

const MILLISECONDS_IN_SECOND = 1000;

export default class ChallengeSocketHandler extends SocketHandler {
	constructor(
		protected roomController: RoomController,
		protected webSocketService: WebSocketService,
		protected socket: any,
		private challengeController: ChallengeController
	) {
		super(roomController, webSocketService, socket);

		socket.on('raise-hand', this.raiseHand);
		socket.on('agree-to-roles', this.agreeToRoles);
		socket.on('add-player-vote', this.addPlayerVote);
		socket.on('remove-player-vote', this.removePlayerVote);
	}

	raiseHand({ roomcode, player, role }) {
		let message = this.challengeController.raiseHand(roomcode, player, role);
		return this.webSocketService.sendToRoom(roomcode, message);
	}

	agreeToRoles({ roomcode, player }) {
		let message = this.challengeController.agreeToRoles(roomcode, player);
		return this.webSocketService.sendToRoom(roomcode, message);
	}

	addPlayerVote({ roomcode, player }) {
		let message = this.challengeController.addPlayerVote(roomcode, player);
		return this.webSocketService.sendToRoom(roomcode, message);
	}

	removePlayerVote({ roomcode, player }) {
		let message = this.challengeController.removePlayerVote(roomcode, player);
		return this.webSocketService.sendToRoom(roomcode, message);
	}

	startTimer(
		roomcode,
		milliseconds,
		interval = MILLISECONDS_IN_SECOND,
		timerTickCallback = (roomcode: string) => {},
		timerDoneCallback = (roomcode: string) => {}
	) {
		this.challengeController.startTimer(roomcode, milliseconds, interval, timerTickCallback, timerDoneCallback);
	}
}
