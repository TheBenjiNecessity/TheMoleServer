import Room from '../models/room.model';
import WebSocketServiceCreator from '../services/websocket.service';
import RoomService from '../services/room/room.service';
import ChallengeService from '../services/game/challenge.service';

class RoomControllerInstance {
	constructor(websocketServiceInstance) {
		this.websocketServiceInstance = websocketServiceInstance;

		this.rooms = {};
		this.challengeData = [];
	}

	async init() {
		this.challengeData = await ChallengeService.listChallengeData();
	}

	roomCodeAlreadyExists(code) {
		return typeof this.rooms[code] !== 'undefined';
	}

	addRoom() {
		var roomcode = this.generateRandomRoomCodeNotUsed();
		this.rooms[roomcode] = new Room(roomcode);
		this.rooms[roomcode].addChallengeData(this.challengeData);
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
		return this.websocketServiceInstance().sendToRoom(roomcode, 'add-player');
	}

	removePlayerFromRoom(roomcode, player) {
		this.rooms[roomcode].removePlayer(player.name);
		return this.websocketServiceInstance().sendToRoom(roomcode, 'remove-player');
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

	performEventOnChallenge(roomcode, event, obj = {}) {
		let func = this.rooms[roomcode].currentEpisode.currentChallenge[event];

		if (func && typeof func === 'function') {
			this.rooms[roomcode].currentEpisode.currentChallenge[event](obj);
		}

		return this.rooms[roomcode];
	}

	/* ===================================== Socket Events ===================================== */
	moveNext(roomcode) {
		this.rooms[roomcode].moveNext();

		return 'move-next';
	}

	// A player has finished their quiz and clicked on the last question
	quizDone(roomcode, playerName, quizAnswers) {
		// a player has finished answering questions in the quiz
		let message = null;
		this.rooms[roomcode].currentEpisode.setQuizResultsForPlayer(playerName, quizAnswers);

		if (this.rooms[roomcode].currentEpisode.allPlayersFinishedQuiz) {
			this.rooms[roomcode].moveNext();
			message = 'move-next';
		}

		return message;
	}
}

export default class RoomController {
	constructor() {}

	static getInstance() {
		if (!RoomController.instance) {
			RoomController.instance = new RoomControllerInstance(() => WebSocketServiceCreator.getInstance());
		}
		return RoomController.instance;
	}
}
