import RoomController from './room.controller';
import challengeData from '../challenges/challenge.data';
import WebSocketServiceCreator from '../services/websocket.service';
import { CHALLENGE_EVENTS, CHALLENGE_STATES, CHALLENGE_SOCKET_EVENTS } from '../contants/challenge.constants';
import ChallengeService from '../services/game/challenge.service';

const MILLISECONDS_IN_SECOND = 1000;

class ChallengeControllerInstance {
	constructor(roomControllerInstance, websocketServiceInstance) {
		this.websocketServiceInstance = websocketServiceInstance;
		this.roomControllerInstance = roomControllerInstance;

		this.challengeClasses = {};
	}

	raiseHand({ roomcode, player, role }) {
		let room = this.roomControllerInstance().getRoom(roomcode);
		if (room.currentEpisode.currentChallenge.state !== CHALLENGE_STATES.ROLE_SELECTION) {
			return;
		}

		this.roomControllerInstance().performEventOnChallenge(
			roomcode,
			CHALLENGE_EVENTS.RAISE_HAND_FOR_PLAYER,
			player,
			role
		);

		return this.websocketServiceInstance().sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.RAISE_HAND);
	}

	/**
	 * Received when a player clicks on the "agree to roles" button on the roles page. Does not accept
	 * input if the role selection is invalid.
	 * @param {*} obj
	 */
	agreeToRoles({ roomcode, player }) {
		let room = this.roomControllerInstance().getRoom(roomcode);
		let { currentChallenge } = room.currentEpisode;
		if (currentChallenge.state !== CHALLENGE_STATES.ROLE_SELECTION || !currentChallenge.raisedHandsAreValid) {
			return;
		}

		this.roomControllerInstance().performEventOnChallenge(roomcode, CHALLENGE_EVENTS.ADD_AGREED_PLAYER, player);

		if (room.currentEpisode.currentChallenge.hasMajorityVoteForAgreedPlayers) {
			room.currentEpisode.currentChallenge.moveNext();
			this.roomControllerInstance().setRoom(room);
			return this.websocketServiceInstance().sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.MOVE_NEXT);
		} else {
			return this.websocketServiceInstance().sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.AGREE_TO_ROLES);
		}
	}

	addPlayerVote({ roomcode, player }) {
		let event = CHALLENGE_EVENTS.SET_VOTED_PLAYER;
		this.roomControllerInstance().performEventOnChallenge(roomcode, event, player);
		return this.websocketServiceInstance().sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.VOTED_PLAYER);
	}

	removePlayerVote({ roomcode, player }) {
		let event = CHALLENGE_EVENTS.REMOVE_VOTED_PLAYER;
		this.roomControllerInstance().performEventOnChallenge(roomcode, event, player);
		return this.websocketServiceInstance().sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.REMOVE_VOTED_PLAYER);
	}

	startTimer(
		roomcode,
		milliseconds,
		interval = MILLISECONDS_IN_SECOND,
		timerTickCallback = this.timerTickCallback,
		timerDoneCallback = this.timerDoneCallback
	) {
		this.roomControllerInstance().performEventOnChallenge(
			roomcode,
			CHALLENGE_EVENTS.START_TIMER,
			roomcode,
			timerTickCallback,
			timerDoneCallback,
			milliseconds,
			interval
		);
	}

	timerTickCallback(roomcode) {
		return this.websocketServiceInstance().sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.TIMER_TICK);
	}

	timerDoneCallback(roomcode) {
		return this.websocketServiceInstance().sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.TIMER_OVER);
	}

	setupSocket(socket) {
		socket.on('raise-hand', this.raiseHand);
		socket.on('agree-to-roles', this.agreeToRoles);
		socket.on('add-player-vote', this.addPlayerVote);
		socket.on('remove-player-vote', this.removePlayerVote);

		for (let type of challengeData) {
			let childInstance = ChallengeService.getChallengeControllerForType(type);
			if (childInstance) {
				childInstance.setupSocket(socket);
			}
		}
	}
}

export default class ChallengeController {
	constructor() {}

	static getInstance() {
		if (!ChallengeController.instance) {
			ChallengeController.instance = new ChallengeControllerInstance(
				() => RoomController.getInstance(),
				() => WebSocketServiceCreator.getInstance()
			);
		}

		return ChallengeController.instance;
	}
}
