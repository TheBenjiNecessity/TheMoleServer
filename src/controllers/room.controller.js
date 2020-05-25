import { Room } from '../models/room.model';

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

		this.webSocketController = webSocketController;
		webSocketController.addEvent('start-game', this.startGame);
		webSocketController.addEvent('start-welcome', this.startWelcome);
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
     *      start-game: the start game button was clicked by one of the players from the game lobby screen.
     *      start-welcome: the start button was clicked by one of the players from the welcome screen
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
		var roomCode = this.getRandomRoomCode();
		this.rooms[roomCode] = new Room(roomCode);
		return this.rooms[roomCode];
	}

	deleteRoom(room) {
		// TODO when do rooms get deleted?
	}

	getRoom(roomCode) {
		return this.rooms[roomCode];
	}

	addPlayerToRoom(room, player) {
		this.rooms[room.roomCode].addPlayer(player);
		let obj = { room: this.rooms[room.roomCode] };
		this.webSocketController.sendToRoom(room.roomCode, 'add-player', obj);
	}

	getRandomRoomCode() {
		var found = false;

		while (!found) {
			// TODO create better algo
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
		}
	}

	startWelcome(roomcode) {
		if (this.rooms[roomcode].startWelcome()) {
			this.webSocketController.sendToRoom(roomcode, 'start-welcome', this.rooms[roomcode]);
		}
	}
}

export class RoomHandlerCreator {
	constructor() {}

	static createController(webSocketController) {
		if (!RoomHandlerCreator.instance) {
			RoomHandlerCreator.instance = new RoomController(webSocketController);
		}

		return RoomHandlerCreator.instance;
	}
}
