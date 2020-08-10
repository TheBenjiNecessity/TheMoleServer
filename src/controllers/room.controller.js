import Room from '../models/room.model';
import ChallengeControllerCreator from '../controllers/challenge.controller';
import WebSocketServiceCreator from '../services/websocket.service';

export class RoomController {
	static generateRandomRoomcode() {
		let code = '';

		for (let i = 0; i < RoomController.MAX_LETTERS; i++) {
			let number = Math.floor(Math.random() * RoomController.CHARACTERS.length);
			code += RoomController.CHARACTERS.charAt(number);
		}

		return code;
	}

	static roomCodeIsABadWord(code) {
		return RoomController.BAD_WORDS.indexOf(code) >= 0;
	}

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
		let obj = { room: this.rooms[roomcode] };
		WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'add-player', obj);
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

		while (!code || this.roomCodeAlreadyExists(code) || RoomController.roomCodeIsABadWord(code)) {
			code = RoomController.generateRandomRoomcode();
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
