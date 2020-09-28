export const MAX_LETTERS: number = 4;
export const CHARACTERS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const BAD_WORDS: string[] = [ 'SHIT', 'FUCK', 'COCK', 'CUNT', 'SLUT', 'TWAT', 'JIZZ', 'TITS', 'CUMS' ];

export default class RoomService {
	static generateRandomRoomcode(): string {
		let code = '';

		for (let i = 0; i < MAX_LETTERS; i++) {
			let number = Math.floor(Math.random() * CHARACTERS.length);
			code += CHARACTERS.charAt(number);
		}

		return code;
	}

	static roomCodeIsABadWord(code): boolean {
		return BAD_WORDS.indexOf(code) >= 0;
	}

	constructor() {}
}
