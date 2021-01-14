import RoomController from './room.controller';
import WebSocketService from '../services/websocket.service';
import SocketHandler from '../interfaces/socket-handler';
import ChallengeController from './challenge.controller';
import Challenge from '../models/challenge.model';

class TempChallengeController extends ChallengeController {
	stateDidChange(roomcode: string, previousState: string, newState: string) {}

	getCurrentChallenge(roomcode: string): Challenge {
		throw new Error('Method not implemented.');
	}
}

export default class ChallengeSocketHandler extends SocketHandler {
	challengeController: TempChallengeController;

	constructor(
		protected roomController: RoomController,
		protected webSocketService: WebSocketService,
		protected socket: any
	) {
		super(roomController, webSocketService, socket);

		this.challengeController = new TempChallengeController(this.roomController);

		socket.on('raise-hand', this.raiseHand);
		socket.on('agree-to-roles', this.agreeToRoles);
		socket.on('add-player-vote', this.addPlayerVote);
		socket.on('remove-player-vote', this.removePlayerVote);
	}

	raiseHand({ roomcode, player, role }) {
		let message = this.challengeController.raiseHand(roomcode, player, role);
		return this.webSocketService.sendToRoom(this.roomController.getRoom(roomcode));
	}

	agreeToRoles({ roomcode, player }) {
		let message = this.challengeController.agreeToRoles(roomcode, player);
		return this.webSocketService.sendToRoom(this.roomController.getRoom(roomcode));
	}

	addPlayerVote({ roomcode, player }) {
		let message = this.challengeController.addPlayerVote(roomcode, player);
		return this.webSocketService.sendToRoom(this.roomController.getRoom(roomcode));
	}

	removePlayerVote({ roomcode, player }) {
		let message = this.challengeController.removePlayerVote(roomcode, player);
		return this.webSocketService.sendToRoom(this.roomController.getRoom(roomcode));
	}
}
