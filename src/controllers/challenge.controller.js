import RoomControllerCreator from './room.controller';
import challengeData from '../models/challenges/challenge.data';
import WebSocketServiceCreator from '../services/websocket.service';
import PlatterChallengeController from '../controllers/challenge-controllers/platter-challenge.controller';
import PathChallengeController from './challenge-controllers/path-challenge.controller';
import { CHALLENGE_EVENTS, CHALLENGE_STATES, CHALLENGE_SOCKET_EVENTS } from '../contants/challenge.constants';

class ChallengeControllerInstance {
	constructor() {
		this.challengeClasses = {};
	}

	raiseHand({ roomcode, player, role }) {
		let room = RoomControllerCreator.getInstance().getRoom(roomcode);
		if (room.currentEpisode.currentChallenge.state !== CHALLENGE_STATES.ROLE_SELECTION) {
			return;
		}

		let event = CHALLENGE_EVENTS.RAISE_HAND_FOR_PLAYER;
		room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, { player, role });

		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.RAISE_HAND, room);
	}

	/**
	 * Received when a player clicks on the "agree to roles" button on the roles page. Does not accept
	 * input if the role selection is invalid.
	 * @param {*} obj
	 */
	agreeToRoles({ roomcode, player }) {
		let room = RoomControllerCreator.getInstance().getRoom(roomcode);
		let { currentChallenge } = room.currentEpisode;
		if (currentChallenge.state !== CHALLENGE_STATES.ROLE_SELECTION || !currentChallenge.raisedHandsAreValid) {
			return;
		}

		let event = CHALLENGE_EVENTS.ADD_AGREED_PLAYER;
		room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, { player });

		if (room.currentEpisode.currentChallenge.hasMajorityVoteForAgreedPlayers) {
			room.currentEpisode.currentChallenge.moveNext();
			RoomControllerCreator.getInstance().setRoom(room);
			return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.MOVE_NEXT, room);
		} else {
			return WebSocketServiceCreator.getInstance().sendToRoom(
				roomcode,
				CHALLENGE_SOCKET_EVENTS.AGREE_TO_ROLES,
				room
			);
		}
	}

	addPlayerVote({ roomcode, player }) {
		let event = CHALLENGE_EVENTS.SET_VOTED_PLAYER;
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, player);
		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.VOTED_PLAYER, room);
	}

	removePlayerVote({ roomcode, player }) {
		let event = CHALLENGE_EVENTS.REMOVE_VOTED_PLAYER;
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, player);
		return WebSocketServiceCreator.getInstance().sendToRoom(
			roomcode,
			CHALLENGE_SOCKET_EVENTS.REMOVE_VOTED_PLAYER,
			room
		);
	}

	setupSocket(socket) {
		socket.on('raise-hand', this.raiseHand);
		socket.on('agree-to-roles', this.agreeToRoles);
		socket.on('add-player-vote', this.addPlayerVote);
		socket.on('remove-player-vote', this.removePlayerVote);

		for (let type of challengeData.map((c) => c.type)) {
			let childInstance = ChallengeController.getChildInstance(type);
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

	static getChildInstance(type) {
		switch (type) {
			case 'platter':
				return PlatterChallengeController.getInstance();
			case 'path':
				return PathChallengeController.getInstance();
			default:
				return null;
		}
	}
}
