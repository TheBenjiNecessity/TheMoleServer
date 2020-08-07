import RoomControllerCreator from './room.controller';
import challengeData from '../models/challenges/challenge.data';
import WebSocketServiceCreator from '../services/websocket.service';
import PlatterChallengeControllerCreator from '../controllers/challenge-controllers/platter-challenge.controller';
import PathChallengeControllerCreator from './challenge-controllers/path-challenge.controller';

class ChallengeController {
	constructor() {
		this.challengeClasses = {};
	}

	raiseHand({ roomcode, player, role }) {
		let event = 'raise-hand-for-player';
		let obj = { player, role };
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, obj);
		WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'raise-hand', room);
	}

	agreeToRoles({ roomcode, player }) {
		let event = 'add-agreed-player';
		let obj = { player };
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, obj);

		if (room.currentChallenge.agreedPlayers.length > room.players.length / 2) {
			WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'move-next', room);
		} else {
			WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'agree-to-roles', room);
		}
	}

	addPlayerVote({ roomcode, player }) {
		let event = 'set-voted-player';
		let obj = { player };
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, obj);
		WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'voted-player', room);
	}

	removePlayerVote({ roomcode, player }) {
		let event = 'remove-voted-player';
		let obj = { player };
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, obj);
		WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'remove-voted-player', room);
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
