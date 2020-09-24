import RoomController from './room.controller';
import challengeData from '../challenges/challenge.data';
import WebSocketServiceCreator from '../services/websocket.service';
import { CHALLENGE_EVENTS, CHALLENGE_STATES, CHALLENGE_SOCKET_EVENTS } from '../contants/challenge.constants';
import ChallengeService from '../services/game/challenge.service';

class ChallengeControllerInstance {
	constructor() {
		this.challengeClasses = {};
	}

	raiseHand({ roomcode, player, role }) {
		let room = RoomController.getInstance().getRoom(roomcode);
		if (room.currentEpisode.currentChallenge.state !== CHALLENGE_STATES.ROLE_SELECTION) {
			return;
		}

		let event = CHALLENGE_EVENTS.RAISE_HAND_FOR_PLAYER;
		room = RoomController.getInstance().performEventOnChallenge(roomcode, event, { player, role });

		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.RAISE_HAND);
	}

	/**
	 * Received when a player clicks on the "agree to roles" button on the roles page. Does not accept
	 * input if the role selection is invalid.
	 * @param {*} obj
	 */
	agreeToRoles({ roomcode, player }) {
		let room = RoomController.getInstance().getRoom(roomcode);
		let { currentChallenge } = room.currentEpisode;
		if (currentChallenge.state !== CHALLENGE_STATES.ROLE_SELECTION || !currentChallenge.raisedHandsAreValid) {
			return;
		}

		let event = CHALLENGE_EVENTS.ADD_AGREED_PLAYER;
		room = RoomController.getInstance().performEventOnChallenge(roomcode, event, { player });

		if (room.currentEpisode.currentChallenge.hasMajorityVoteForAgreedPlayers) {
			room.currentEpisode.currentChallenge.moveNext();
			RoomController.getInstance().setRoom(room);
			return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.MOVE_NEXT);
		} else {
			return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.AGREE_TO_ROLES);
		}
	}

	addPlayerVote({ roomcode, player }) {
		let event = CHALLENGE_EVENTS.SET_VOTED_PLAYER;
		RoomController.getInstance().performEventOnChallenge(roomcode, event, player);
		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.VOTED_PLAYER);
	}

	removePlayerVote({ roomcode, player }) {
		let event = CHALLENGE_EVENTS.REMOVE_VOTED_PLAYER;
		RoomController.getInstance().performEventOnChallenge(roomcode, event, player);
		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.REMOVE_VOTED_PLAYER);
	}

	startTimer(roomcode, minutes) {
		let room = RoomController.getInstance().performEventOnChallenge(roomcode, 'startTimerWithCallback', {
			roomcode,
			duringCB: this.timerTickCallback,
			endCB: this.timerDoneCallback,
			minutes
		});

		return room;
	}

	timerTickCallback(roomcode) {
		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.TIMER_TICK);
	}

	timerDoneCallback(roomcode) {
		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'challenge-timer-end');
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
			ChallengeController.instance = new ChallengeControllerInstance();
		}

		return ChallengeController.instance;
	}
}
