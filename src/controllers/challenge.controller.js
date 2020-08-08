import RoomControllerCreator from './room.controller';
import challengeData from '../models/challenges/challenge.data';
import WebSocketServiceCreator from '../services/websocket.service';
import PlatterChallengeControllerCreator from '../controllers/challenge-controllers/platter-challenge.controller';
import PathChallengeControllerCreator from './challenge-controllers/path-challenge.controller';
import Challenge from '../models/challenges/challenge.model';

class ChallengeController {
	constructor() {
		this.challengeClasses = {};
	}

	raiseHand({ roomcode, player, role }) {
		let event = Challenge.CHALLENGE_EVENTS.RAISE_HAND_FOR_PLAYER;
		let obj = { player, role };
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, obj);
		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'raise-hand', room);
	}

	agreeToRoles({ roomcode, player }) {
		let event = Challenge.CHALLENGE_EVENTS.ADD_AGREED_PLAYER;
		let obj = { player };
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, obj);

		if (room.currentChallenge.agreedPlayers.length > room.players.length / 2) {
			return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'move-next', room);
		} else {
			return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'agree-to-roles', room);
		}
	}

	addPlayerVote({ roomcode, player }) {
		let event = Challenge.CHALLENGE_EVENTS.SET_VOTED_PLAYER;
		let obj = { player };
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, obj);
		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'voted-player', room);
	}

	removePlayerVote({ roomcode, player }) {
		let event = Challenge.CHALLENGE_EVENTS.REMOVE_VOTED_PLAYER;
		let obj = { player };
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, obj);
		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'remove-voted-player', room);
	}

	setupSocket(socket) {
		socket.on('raise-hand', this.raiseHand);

		socket.on('agree-to-roles', this.agreeToRoles);

		socket.on('add-player-vote', this.addPlayerVote);

		socket.on('remove-player-vote', this.removePlayerVote);

		for (let type of Object.keys(challengeData)) {
			let childInstance = ChallengeControllerCreator.getChildInstance(type);
			if (childInstance) {
				childInstance.setupSocket(socket);
			}
		}
	}
}

export default class ChallengeControllerCreator {
	constructor() {}

	static getInstance() {
		if (!ChallengeControllerCreator.instance) {
			ChallengeControllerCreator.instance = new ChallengeController();
		}

		return ChallengeControllerCreator.instance;
	}

	static getChildInstance(type) {
		switch (type) {
			case 'platter':
				return PlatterChallengeControllerCreator.getInstance();
			case 'path':
				return PathChallengeControllerCreator.getInstance();
			default:
				return null;
		}
	}
}
