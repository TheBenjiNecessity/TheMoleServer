import Room from '../models/room.model';
import WebSocketService from '../services/websocket.service';
import RoomService from '../services/room/room.service';
import ChallengeData from '../interfaces/challenge-data';
import Player from '../models/player.model';
import { CHALLENGE_SOCKET_EVENTS } from '../contants/challenge.constants';

export default class RoomController {
	constructor(
		private websocketService: WebSocketService,
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

	roomCodeAlreadyExists(roomcode: string) {
		return typeof this.rooms[roomcode] !== 'undefined';
	}

	addRoom(language: string) {
		var roomcode = this.generateRandomRoomCodeNotUsed();
		this.rooms[roomcode] = new Room(roomcode, language);
		return this.rooms[roomcode];
	}

	setChallengeDataForRoom(roomcode: string) {
		this.rooms[roomcode].addChallengeData(this.challengeData);
	}

	deleteRoom(roomcode: string) {
		delete this.rooms[roomcode];
	}

	getRoom(roomcode: string) {
		return this.rooms[roomcode];
	}

	setRoom(room: Room) {
		this.rooms[room.roomcode] = room;
	}

	addPlayerToRoom(roomcode: string, player: Player) {
		this.rooms[roomcode].addPlayer(player);
		return this.websocketService.sendToRoom(roomcode, 'add-player');
	}

	removePlayerFromRoom(roomcode: string, player: Player) {
		this.rooms[roomcode].removePlayer(player.name);
		return this.websocketService.sendToRoom(roomcode, 'remove-player');
	}

	giveObjectsToPlayer(roomcode: string, playerName: string, obj: string, quantity: number) {
		this.rooms[roomcode].giveObjectsToPlayer(playerName, obj, quantity);
	}

	removeObjectsFromPlayer(roomcode: string, playerName: string, obj: string, quantity: number) {
		this.rooms[roomcode].removeObjectsFromPlayer(playerName, obj, quantity);
	}

	addPoints(roomcode: string, points: number = 1) {
		this.rooms[roomcode].addPoints(points);
	}

	removePoints(roomcode: string, points: number = 1) {
		this.rooms[roomcode].removePoints(points);
	}

	generateRandomRoomCodeNotUsed() {
		let code = null;

		do {
			code = RoomService.generateRandomRoomcode();
		} while (this.roomCodeAlreadyExists(code) || RoomService.roomCodeIsABadWord(code));

		return code;
	}

	getCurrentChallenge(roomcode: string) {
		return this.rooms[roomcode].currentEpisode.currentChallenge;
	}

	/* ===================================== Challenge Events =====================================*/
	endChallenge(roomcode: string) {
		this.getCurrentChallenge(roomcode).endChallenge();
	}

	performEventOnChallenge(roomcode: string, event: string, ...args) {
		this.getCurrentChallenge(roomcode)[event](...args);
		return this.rooms[roomcode];
	}

	/* ===================================== Socket Events ===================================== */
	moveNext(roomcode: string) {
		this.rooms[roomcode].moveNext();

		return 'move-next';
	}

	// A player has finished their quiz and clicked on the last question
	quizDone(roomcode: string, playerName: string, quizAnswers) {
		// a player has finished answering questions in the quiz
		let message = null;
		this.rooms[roomcode].currentEpisode.setQuizResultsForPlayer(playerName, quizAnswers);

		if (this.rooms[roomcode].currentEpisode.allPlayersFinishedQuiz) {
			message = this.moveNext(roomcode);
		}

		return message;
	}

	sendTimerTick(roomcode: string) {
		return this.websocketService.sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.TIMER_TICK);
	}

	sendTimerDone(roomcode: string) {
		return this.websocketService.sendToRoom(roomcode, CHALLENGE_SOCKET_EVENTS.TIMER_TICK);
	}
}
