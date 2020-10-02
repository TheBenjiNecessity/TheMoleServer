import Room from '../models/room.model';
import WebSocketService from '../services/websocket.service';
import RoomService from '../services/room/room.service';
import ChallengeData from '../interfaces/challenge-data';

export default class RoomController {
	constructor(
		private websocketServiceInstance: WebSocketService,
		private challengeData: ChallengeData[],
		private roomGetter: () => { [id: string]: Room },
		private roomSetter: (rooms: { [id: string]: Room }) => void
	) {}

	get rooms(): { [id: string]: Room } {
		return this.roomGetter();
	}

	set rooms(rooms: { [id: string]: Room }) {
		this.roomSetter(rooms);
	}

	roomCodeAlreadyExists(code) {
		return typeof this.rooms[code] !== 'undefined';
	}

	addRoom() {
		var roomcode = this.generateRandomRoomCodeNotUsed();
		this.rooms[roomcode] = new Room(roomcode);
		return this.rooms[roomcode];
	}

	setChallengeDataForRoom(roomcode) {
		this.rooms[roomcode].addChallengeData(this.challengeData);
	}

	deleteRoom(roomcode) {
		delete this.rooms[roomcode];
	}

	getRoom(roomcode) {
		return this.rooms[roomcode];
	}

	setRoom(room) {
		this.rooms[room.roomcode] = room;
	}

	addPlayerToRoom(roomcode, player) {
		this.rooms[roomcode].addPlayer(player);
		return this.websocketServiceInstance.sendToRoom(roomcode, 'add-player');
	}

	removePlayerFromRoom(roomcode, player) {
		this.rooms[roomcode].removePlayer(player.name);
		return this.websocketServiceInstance.sendToRoom(roomcode, 'remove-player');
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

	performEventOnChallenge(roomcode, event, ...args) {
		this.rooms[roomcode].currentEpisode.currentChallenge[event].apply(null, args);
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
			message = this.moveNext(roomcode);
		}

		return message;
	}
}
