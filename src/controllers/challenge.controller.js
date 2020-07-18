import { RoomHandlerCreator } from './room.controller';
import challengeData from '../models/challenges/challenge.data';
import WebSocketServiceCreator from '../services/websocket.service';

class ChallengeController {
	constructor() {
		this.challengeClasses = {};
	}

	event(obj) {
		this[obj.event](obj.data);
	}

	raiseHand({ room, player, role }) {
		let { roomcode } = room;

		let roomHandler = RoomHandlerCreator.getInstance();
		let room2 = roomHandler.rooms[roomcode];
		room2.currentChallenge.raiseHandForPlayer(player, role);

		WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'raise-hand', room2);
	}

	agreeToRoles({ room, player }) {
		let { roomcode } = room;

		let roomHandler = RoomHandlerCreator.getInstance();
		roomHandler.rooms[roomcode].currentChallenge.addAgreedPlayer(player);

		if (
			roomHandler.rooms[roomcode].currentChallenge.agreedPlayers.length >
			roomHandler.rooms[roomcode].players.length / 2
		) {
			roomHandler.rooms[roomcode].currentChallenge.agreedPlayers = [];
			roomHandler.rooms[roomcode].raisedHands = {};
			WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'move-next', roomHandler.rooms[roomcode]);
		} else {
			WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'agree-to-roles', roomHandler.rooms[roomcode]);
		}
	}

	addPlayerVote({ room, player }) {
		let newRoom = RoomHandlerCreator.getInstance().rooms[room.roomcode];
		newRoom.currentChallenge.setVotedPlayer(player);
		WebSocketServiceCreator.getInstance().sendToRoom(room.roomcode, 'voted-player', newRoom);
	}

	removePlayerVote({ room, player }) {
		let newRoom = RoomHandlerCreator.getInstance().rooms[room.roomcode];
		newRoom.currentChallenge.removeVotedPlayer(player);
		WebSocketServiceCreator.getInstance().sendToRoom(room.roomcode, 'remove-voted-player', newRoom);
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
				return new PlatterChallengeController();
			default:
				return null;
		}
	}
}
