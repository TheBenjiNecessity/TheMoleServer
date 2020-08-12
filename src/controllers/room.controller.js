import Room, { ROOM_STATE } from '../models/room.model';
import ChallengeControllerCreator from '../controllers/challenge.controller';
import WebSocketServiceCreator from '../services/websocket.service';
import RoomService from '../services/room/roomcode.service';
import EpisodeService from '../services/game/episode.service';
import ArrayUtilsService from '../services/utils/array-utils.service';

class RoomController {
	constructor() {
		this.rooms = {};
	}

	roomCodeAlreadyExists(code) {
		return typeof this.rooms[code] !== 'undefined';
	}

	addRoom() {
		var roomcode = this.generateRandomRoomCodeNotUsed();
		this.rooms[roomcode] = new Room(roomcode);
		return this.rooms[roomcode];
	}

	deleteRoom(room) {
		// TODO when do rooms get deleted?
	}

	getRoom(roomcode) {
		return this.rooms[roomcode];
	}

	setRoom(room) {
		this.rooms[room.roomcode] = room;
	}

	addPlayerToRoom(roomcode, player) {
		this.rooms[roomcode].addPlayer(player);
		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'add-player', this.rooms[roomcode]);
	}

	giveObjectsToPlayer(roomcode, playerName, obj, quantity) {
		this.rooms[roomcode].giveObjectsToPlayer(playerName, obj, quantity);
	}

	removeObjectsFromPlayer(roomcode, playerName, obj, quantity) {
		this.rooms[roomcode].removeObjectsFromPlayer(playerName, obj, quantity);
	}

	addPoints(roomcode, points = 1) {
		this.rooms[roomcode].addPoints(points);
	}

	removePoints(roomcode, points = 1) {
		this.rooms[roomcode].removePoints(points);
	}

	generateRandomRoomCodeNotUsed() {
		let code = null;

		do {
			code = RoomService.generateRandomRoomcode();
		} while (this.roomCodeAlreadyExists(code) || RoomService.roomCodeIsABadWord(code));

		return code;
	}

	moveNext(roomcode) {
		if (this.rooms[roomcode].moveNext()) {
			WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'move-next', this.rooms[roomcode]);

			switch (this.rooms[roomcode].state) {
				case ROOM_STATE.WELCOME:
					this.rooms[roomcode].isInProgress = true;
					//WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'game-loaded', this.rooms[roomcode]);
					break;
				case ROOM_STATE.EPISODE_START:
					this.rooms[roomcode].currentEpisode = EpisodeService.getEpisode(this.rooms[roomcode]);
					WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'episode-loaded', this.rooms[roomcode]);
					break;
				case ROOM_STATE.IN_CHALLENGE:
					break;
				case ROOM_STATE.BEFORE_CHALLENGE:
				case ROOM_STATE.BEFORE_QUIZ:
				case ROOM_STATE.IN_QUIZ:
			}

			if (this.rooms[roomcode].isStateWelcome) {
			}
		}
	}

	popRandomChallengeForRoom(roomcode, numPlayers) {
		let room = this.getRoom(roomcode);
		//let numRestrictedChallenges = room.ava

		//ArrayUtilsService.
	}

	performEventOnChallenge(roomcode, event, obj) {
		let room = this.rooms[roomcode];
		room.currentChallenge.performEvent(event, obj);
		this.setRoom(room);
		return room;
	}

	setupSocket(socket) {
		socket.on('page-next', this.moveNext);

		ChallengeControllerCreator.getInstance().setupSocket(socket);
	}
}

export default class RoomControllerCreator {
	constructor() {}

	static getInstance() {
		if (!RoomControllerCreator.instance) {
			RoomControllerCreator.instance = new RoomController();
		}
		return RoomControllerCreator.instance;
	}
}
