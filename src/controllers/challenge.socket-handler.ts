import RoomController from './room.controller';
import WebSocketService from '../services/websocket.service';
import { CHALLENGE_EVENTS, CHALLENGE_STATES, CHALLENGE_SOCKET_EVENTS } from '../contants/challenge.constants';
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
		let room = this.roomController.getRoom(roomcode);
		if (room.currentEpisode.currentChallenge.state !== CHALLENGE_STATES.ROLE_SELECTION) {
			return;
		}

		this.roomController.performEventOnChallenge(roomcode, CHALLENGE_EVENTS.RAISE_HAND_FOR_PLAYER, player, role);

		return this.webSocketService.sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.RAISE_HAND);
	}

	agreeToRoles({ roomcode, player }) {
		let room = this.roomController.getRoom(roomcode);
		let { currentChallenge } = room.currentEpisode;
		if (currentChallenge.state !== CHALLENGE_STATES.ROLE_SELECTION || !currentChallenge.raisedHandsAreValid) {
			return;
		}

		this.roomController.performEventOnChallenge(roomcode, CHALLENGE_EVENTS.ADD_AGREED_PLAYER, player);

		if (room.currentEpisode.currentChallenge.hasMajorityVoteForAgreedPlayers) {
			room.currentEpisode.currentChallenge.moveNext();
			this.roomController.setRoom(room);
			return this.webSocketService.sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.MOVE_NEXT);
		} else {
			return this.webSocketService.sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.AGREE_TO_ROLES);
		}
	}

	addPlayerVote({ roomcode, player }) {
		let event = CHALLENGE_EVENTS.SET_VOTED_PLAYER;
		this.roomController.performEventOnChallenge(roomcode, event, player);
		return this.webSocketService.sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.VOTED_PLAYER);
	}

	removePlayerVote({ roomcode, player }) {
		let event = CHALLENGE_EVENTS.REMOVE_VOTED_PLAYER;
		this.roomController.performEventOnChallenge(roomcode, event, player);
		return this.webSocketService.sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.REMOVE_VOTED_PLAYER);
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
