export default function stringExtensions() {
	String.prototype.shuffle = function() {
		let stringArray = this.split('');

		if (stringArray.length < 2) return;

		for (let i = 0; i < stringArray.length; i++) {
			let r = Math.floor(Math.random() * stringArray.length);

			[ stringArray[i], stringArray[r] ] = [ stringArray[r], stringArray[i] ];
		}

		return stringArray.join('');
	};

	String.prototype.randomCypherText = function() {
		const alphabet = 'abcdefghijklmnopqrstuvwxyz';
		let shuffledAlphabet = alphabet;
		shuffledAlphabet.shuffle();
		let result = '';
		for (let i = 0; i < this.length; i++) {
			let currentChar = this.charAt(i);
			let letterIndex = alphabet.indexOf(currentChar);
			if (letterIndex >= 0) {
				let cypherChar = shuffledAlphabet.charAt(letterIndex);
				result += cypherChar;
			} else {
				result += currentChar;
			}
		}
		return result;
	};
}
