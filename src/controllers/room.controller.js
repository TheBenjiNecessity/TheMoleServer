import Room, { ROOM_STATE } from '../models/room.model';
import ChallengeController from '../controllers/challenge.controller';
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

	removePlayerFromRoom(roomcode, player) {
		this.rooms[roomcode].removePlayer(player.name);
		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'remove-player', this.rooms[roomcode]);
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

	/* ===================================== Socket Events ===================================== */
	moveNext({ roomcode }) {
		if (this.rooms[roomcode].moveNext()) {
			WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'move-next', this.rooms[roomcode]);
		}
	}

	quizDone({ roomcode, player }) {
		// a player has finished answering questions in the quiz
		this.rooms[roomcode].setQuizResultsForPlayer(player);

		if (this.rooms[roomcode].currentEpisode.allPlayersFinishedQuiz && this.rooms[roomcode].moveNext()) {
			WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'move-next', this.rooms[roomcode]);
		}
	}

	performEventOnChallenge(roomcode, event, obj = {}) {
		this.rooms[roomcode].currentEpisode.currentChallenge[event](obj);
		return this.rooms[roomcode];
	}

	setupSocket(socket) {
		socket.on('move-next', this.moveNext);
		socket.on('quiz-done', this.quizDone);

		ChallengeController.getInstance().setupSocket(socket);
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
