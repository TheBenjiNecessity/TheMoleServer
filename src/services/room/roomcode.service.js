import Player from '../../models/player.model';
import Room from '../../models/room.model';

export const MAX_LETTERS = 4;
export const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const BAD_WORDS = [ 'SHIT', 'FUCK', 'COCK', 'CUNT', 'SLUT', 'TWAT', 'JIZZ', 'TITS', 'CUMS' ];

export default class RoomService {
	static generateRandomRoomcode() {
		let code = '';

		for (let i = 0; i < MAX_LETTERS; i++) {
			let number = Math.floor(Math.random() * CHARACTERS.length);
			code += CHARACTERS.charAt(number);
		}

		return code;
	}

	static roomCodeIsABadWord(code) {
		return BAD_WORDS.indexOf(code) >= 0;
	}

	static getTestRoomWithTenPlayers() {
		let room = new Room('TEST');

		room.addPlayer(new Player('test1'));
		room.addPlayer(new Player('test2'));
		room.addPlayer(new Player('test3'));
		room.addPlayer(new Player('test4'));
		room.addPlayer(new Player('test5'));
		room.addPlayer(new Player('test6'));
		room.addPlayer(new Player('test7'));
		room.addPlayer(new Player('test8'));
		room.addPlayer(new Player('test9'));
		room.addPlayer(new Player('test0'));

		return room;
	}

	static getTestRoomWithFivePlayers() {
		let room = new Room('TEST');

		room.addPlayer(new Player('test1'));
		room.addPlayer(new Player('test2'));
		room.addPlayer(new Player('test3'));
		room.addPlayer(new Player('test4'));
		room.addPlayer(new Player('test5'));

		return room;
	}

	static getTestRoomWithNoPlayers() {
		return new Room('TEST');
	}

	constructor() {}
}
