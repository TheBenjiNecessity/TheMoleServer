import { Room } from '../models/room.model';
import EpisodeService from '../services/game/episode.service';
import ChallengeControllerCreator from '../controllers/challenge.controller';
import WebSocketServiceCreator from '../services/websocket.service';

const badwords = [ 'SHIT', 'FUCK', 'COCK', 'CUNT', 'SLUT', 'TWAT' ];

class RoomController {
	constructor() {
		this.rooms = {};
		this.characters = [
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

		this.episodeService = new EpisodeService();
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

	addPlayerToRoom(room, player) {
		this.rooms[room.roomcode].addPlayer(player);
		let obj = { room: this.rooms[room.roomcode] };
		WebSocketServiceCreator.getInstance().sendToRoom(room.roomcode, 'add-player', obj);
	}

	giveObjectsToPlayer(roomcode, player, obj, quantity) {
		// various object could be:
		// exemption, joker, black exemption
		this.rooms[roomcode].giveObjectsToPlayer(player, obj, quantity);
	}

	getRandomRoomCode() {
		var found = false;

		while (!found) {
			var number1 = Math.floor(Math.random() * this.characters.length);
			var number2 = Math.floor(Math.random() * this.characters.length);
			var number3 = Math.floor(Math.random() * this.characters.length);
			var number4 = Math.floor(Math.random() * this.characters.length);

			var code =
				this.characters[number1] +
				this.characters[number2] +
				this.characters[number3] +
				this.characters[number4];

			found = typeof this.rooms[code] === 'undefined';

			// Avoid code being a bad word
			if (badwords.indexOf(code) >= 0) {
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
				this.rooms[roomcode].episodes = this.episodeService.getEpisodes(numPlayers);
				WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'game-loaded', this.rooms[roomcode]);
			}
		}
	}

	setupSocket(socket) {
		socket.on('page-next', this.moveNext);

		ChallengeControllerCreator.getInstance().setupSocket(socket);
	}
}

export class RoomHandlerCreator {
	constructor() {}

	static getInstance() {
		if (!RoomHandlerCreator.instance) {
			RoomHandlerCreator.instance = new RoomController();
		}
		return RoomHandlerCreator.instance;
	}
}
