import Room from '../models/room.model';
import EpisodeService from '../services/game/episode.service';
import ChallengeControllerCreator from '../controllers/challenge.controller';
import WebSocketServiceCreator from '../services/websocket.service';

const MAX_LETTERS = 4;
const CHARACTERS = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z'
];
const BAD_WORDS = [ 'SHIT', 'FUCK', 'COCK', 'CUNT', 'SLUT', 'TWAT', 'JIZZ', 'TITS', 'CUMS' ];

class RoomController {
	constructor() {
		this.rooms = {};
	}

	addRoom() {
		var roomcode = this.getRandomRoomCode();
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

	giveObjectsToPlayer(roomcode, player, obj, quantity) {
		// various object could be:
		// exemption, joker, black exemption
		this.rooms[roomcode].giveObjectsToPlayer(player, obj, quantity);
	}

	getRandomRoomCode() {
		let found = false;

		while (!found) {
			let code = '';

			for (let i = 0; i < MAX_LETTERS; i++) {
				let number = Math.floor(Math.random() * CHARACTERS.length);
				code += CHARACTERS[number];
			}

			found = typeof this.rooms[code] === 'undefined';

			// Avoid code being a bad word
			if (BAD_WORDS.indexOf(code) >= 0) {
				found = false;
			}
		}

		return code;
	}

	moveNext(roomcode) {
		if (this.rooms[roomcode].moveNext()) {
			WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'move-next', this.rooms[roomcode]);

			if (this.rooms[roomcode].isStateWelcome) {
				let numPlayers = this.rooms[roomcode].players.length;
				this.rooms[roomcode].episodes = EpisodeService.getEpisodes(numPlayers);
				WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'game-loaded', this.rooms[roomcode]);
			}
		}
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
