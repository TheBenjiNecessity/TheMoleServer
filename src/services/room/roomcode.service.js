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

	constructor() {}
}
