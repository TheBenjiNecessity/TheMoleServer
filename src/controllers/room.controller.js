import Room from '../models/room.model';
import ChallengeControllerCreator from '../controllers/challenge.controller';
import WebSocketServiceCreator from '../services/websocket.service';
import RoomService from '../services/room/roomcode.service';

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

		while (!code || this.roomCodeAlreadyExists(code) || RoomService.roomCodeIsABadWord(code)) {
			code = RoomService.generateRandomRoomcode();
		}

		return code;
	}

	moveNext(roomcode) {
		if (this.rooms[roomcode].moveNext()) {
			WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'move-next', this.rooms[roomcode]);

			if (this.rooms[roomcode].isStateWelcome) {
				this.rooms[roomcode].generateEpisodes();
				WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'game-loaded', this.rooms[roomcode]);
			}
		}
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
