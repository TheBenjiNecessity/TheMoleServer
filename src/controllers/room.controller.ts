import Room from '../models/room.model';
import WebSocketService from '../services/websocket.service';
import RoomService from '../services/room/room.service';
import ChallengeData from '../interfaces/challenge-data';
import Player from '../models/player.model';
import { CHALLENGE_SOCKET_EVENTS } from '../contants/challenge.constants';
import QuizAnswers from '../models/quiz/quiz-answers.model';

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

	/* ======================================== Convenience methods ======================================== */
	roomCodeAlreadyExists(roomcode: string) {
		return typeof this.rooms[roomcode] !== 'undefined';
	}

	getCurrentChallenge(roomcode: string) {
		return this.rooms[roomcode].currentEpisode.currentChallenge;
	}

	generateRandomRoomCodeNotUsed() {
		let code = null;

		do {
			code = RoomService.generateRandomRoomcode();
		} while (this.roomCodeAlreadyExists(code) || RoomService.roomCodeIsABadWord(code));

		return code;
	}

	/* ======================================== Room manipulation methods ======================================== */
	addRoom(language: string) {
		const roomcode = this.generateRandomRoomCodeNotUsed();
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
		return this.websocketService.sendToRoom(this.getRoom(roomcode));
	}

	removePlayerFromRoom(roomcode: string, playerName: string) {
		this.rooms[roomcode].removePlayer(playerName);
		return this.websocketService.sendToRoom(this.getRoom(roomcode));
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

	/* ===================================== Challenge Events =====================================*/
	endChallenge(roomcode: string) {
		this.getCurrentChallenge(roomcode).endChallenge();
		clearInterval(this.rooms[roomcode].timer);
		this.moveNext(roomcode);
	}

	performEventOnChallenge(roomcode: string, event: string, ...args) {
		let currentChallenge = this.getCurrentChallenge(roomcode);
		if (!currentChallenge) {
			return this.rooms[roomcode];
		}

		const previousChallengeState = currentChallenge.state;
		this.getCurrentChallenge(roomcode)[event](...args);
		const newChallengeState = this.getCurrentChallenge(roomcode).state;

		if (previousChallengeState && previousChallengeState !== newChallengeState) {
			//perform life cycle event
			this.rooms[roomcode].currentEpisode
				.getCurrentChallengeController(this)
				.stateDidChange(roomcode, previousChallengeState, newChallengeState);
		}

		return this.rooms[roomcode];
	}

	/* ===================================== Socket Events ===================================== */
	moveNext(roomcode: string) {
		this.rooms[roomcode].moveNext();

		return 'move-next';
	}

	quizDone(roomcode: string, playerName: string, quizAnswers: QuizAnswers) {
		if (this.rooms[roomcode].state !== Room.ROOM_STATES.IN_QUIZ) {
			return null;
		}

		let message = 'quiz-done';
		this.rooms[roomcode].currentEpisode.setQuizResultsForPlayer(playerName, quizAnswers);

		if (this.rooms[roomcode].currentEpisode.allPlayersFinishedQuiz) {
			message = this.moveNext(roomcode);
		}

		return message;
	}

	addAgreeToMoveNextPlayer(roomcode, playerName) {
		this.rooms[roomcode].addAgreeToMoveNextPlayer(playerName);

		if (this.rooms[roomcode].canMoveNext) {
			this.moveNext(roomcode);
		}

		return 'agree-to-move-next';
	}

	sendTimerTick(roomcode: string) {
		return this.websocketService.sendToRoom(this.getRoom(roomcode), CHALLENGE_SOCKET_EVENTS.TIMER_TICK);
	}

	sendTimerDone(roomcode: string) {
		return this.websocketService.sendToRoom(this.getRoom(roomcode), CHALLENGE_SOCKET_EVENTS.TIMER_TICK);
	}

	startTimer(
		roomcode: string,
		millisecondsFromNow: number,
		millisecondsInterval: number,
		tickCB: () => any = () => this.sendTimerTick(roomcode),
		doneCB: () => any = () => this.sendTimerDone(roomcode)
	) {
		this.rooms[roomcode].startTimerWithCallback(millisecondsFromNow, millisecondsInterval, tickCB, doneCB);
	}
}
