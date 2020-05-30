import { Room } from '../models/room.model';
import EpisodeService from '../services/game/episode.service';
import { ChallengeControllerCreator } from '../controllers/challenge.controller';

class RoomController {
	constructor(webSocketController) {
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
			'Z',
			'0',
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9',
			'0'
		];

		this.episodeService = new EpisodeService();

		this.webSocketController = webSocketController;
	}

	/**
     * What does this controller do?:
     *  - Handles high level room events
     *  - Anything that has to do with the room but not:
     *      - Episodes
     *      - Challenges
     *      - Quizes
     * Events:
     *  - Add room
     *  - Delete room
     *  - Get Room
     *  - Update Room
     *      - add player
     *  - Generate room with code
     * Socket Events:
     *  - to server:
     *      start-game: 
	 * 			the start game button was clicked by one of the players from the game lobby screen.
	 * 			result: send this event to all other players
     *      start-welcome: 
	 * 			the start button was clicked by one of the players from the welcome screen
	 * 			result: send this event to all other players
     *  - from server:
     *      game-start: a player has clicked on the start game button from the lobby and the server is telling everyone else
     *      welcome-start: a player has clicked on the start game button from the welcome screen and the server is telling everyone else
     *  When a player clicks on the start game button:
     *  - Setup up game on server
     *      - Create 1 fewer episode than players playing
     *      - Episode
     *          - create a number of challenges.
     *          - challenges should be stored in an array that you pop from
     *          - Randomly grab a set of challenges from the array based on the number of players in this episode
     *              - shuffle the challenge array then iterate over it grabbing the first challenge that fits the player number. remove that challenge from the array.
     *          - create a quiz based on these challenges (as well as random other questions)
     *          - pull questions from an array (shuffle array then pop)
     *
     *          - Challenge
     *              - title
     *              - description
     *              - get specific challenge controller (different controllers per game)
     * 
     *          - Quiz
     *              - questions
     *              - quiz controller
     */

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
		this.webSocketController.sendToRoom(room.roomcode, 'add-player', obj);
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
		}

		return code;
	}

	startGame(roomcode) {
		if (this.rooms[roomcode].startGame()) {
			this.webSocketController.sendToRoom(roomcode, 'start-game', this.rooms[roomcode]);
			this.rooms[roomcode].episodes = this.episodeService.getEpisodes(this.rooms[roomcode].players.length);
			this.webSocketController.sendToRoom(roomcode, 'game-loaded', this.rooms[roomcode]);
		}
	}

	startWelcome(roomcode) {
		if (this.rooms[roomcode].startWelcome()) {
			this.webSocketController.sendToRoom(roomcode, 'start-welcome', this.rooms[roomcode]);
		}
	}

	raiseHand(obj) {
		let { player, room, role } = obj;
		let { roomcode } = room;

		if (!this.rooms[roomcode].raisedHands[role].length) {
			this.rooms[roomcode].raisedHands[role] = [ player ];
		} else {
			this.rooms[roomcode].raisedHands[role].push(player);
		}

		this.webSocketController.sendToRoom(roomcode, 'raise-hand', this.rooms[roomcode]);
	}

	agreeToRoles(obj) {
		let { player, room } = obj;
		let { roomcode } = room;
		this.rooms[roomcode].agreedPlayers.push(player);

		if (this.rooms[roomcode].agreedPlayers.length > this.rooms[roomcode].players.length / 2) {
			this.rooms[roomcode].agreedPlayers = [];
			this.rooms[roomcode].raisedHands = {};
			this.webSocketController.sendToRoom(roomcode, 'start-challenge', this.rooms[roomcode]);
		} else {
			this.webSocketController.sendToRoom(roomcode, 'agree-to-roles', this.rooms[roomcode]);
		}
	}

	challengeEvent(obj) {
		ChallengeControllerCreator.getInstance().event(obj);
	}

	setupSocket(socket) {
		socket.on('start-game', this.startGame);
		socket.on('start-welcome', this.startWelcome);

		socket.on('raise-hand', this.raiseHand);
		socket.on('agree-to-roles', this.agreeToRoles);

		socket.on('challenge-event', this.challengeEvent);
	}
}

export class RoomHandlerCreator {
	constructor() {}

	static getInstance() {
		return RoomHandlerCreator.instance;
	}

	static createController(webSocketController) {
		if (!RoomHandlerCreator.instance) {
			RoomHandlerCreator.instance = new RoomController(webSocketController);
		}

		return RoomHandlerCreator.instance;
	}
}
