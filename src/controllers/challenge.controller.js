import RoomControllerCreator from './room.controller';
import challengeData from '../models/challenges/challenge.data';
import WebSocketServiceCreator from '../services/websocket.service';
import PlatterChallengeController from '../controllers/challenge-controllers/platter-challenge.controller';
import PathChallengeController from './challenge-controllers/path-challenge.controller';
import Challenge, { CHALLENGE_EVENTS } from '../models/challenges/challenge.model';

class ChallengeControllerInstance {
	constructor() {
		this.challengeClasses = {};
	}

	raiseHand({ roomcode, player, role }) {
		let event = CHALLENGE_EVENTS.RAISE_HAND_FOR_PLAYER;
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, { player, role });
		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'raise-hand', room);
	}

	agreeToRoles({ roomcode, player }) {
		let event = CHALLENGE_EVENTS.ADD_AGREED_PLAYER;
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, { player });

		if (room.currentEpisode.currentChallenge.hasMajorityVoteForAgreedPlayers) {
			room.setRoles(room.currentEpisode.currentChallenge.raiseHands);
			room.currentEpisode.currentChallenge.moveNext();
			RoomControllerCreator.getInstance().setRoom(room);
			return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'challenge-move-next', room);
		} else {
			return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'agree-to-roles', room);
		}
	}

	addPlayerVote({ roomcode, player }) {
		let event = CHALLENGE_EVENTS.SET_VOTED_PLAYER;
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, { player });
		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'voted-player', room);
	}

	removePlayerVote({ roomcode, player }) {
		let event = CHALLENGE_EVENTS.REMOVE_VOTED_PLAYER;
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, { player });
		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'remove-voted-player', room);
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
