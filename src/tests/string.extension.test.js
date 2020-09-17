import stringExtensions from '../extensions/string';

stringExtensions();

test('Checks shuffle method', () => {
	let unshuffledString = 'abcdef';
	unshuffledString.shuffle();
	expect(unshuffledString.length).toBe(6);
	for (let letter of unshuffledString) {
		expect(unshuffledString.indexOf(letter) >= 0).toBe(true);
	}
});

test('Checks randomCypherText method', () => {
	let unshuffledString = 'abc de fa';
	let randomCypherText = unshuffledString.randomCypherText();
	expect(randomCypherText.length).toBe(9);
	expect(randomCypherText.charAt(3)).toBe(' ');
	expect(randomCypherText.charAt(6)).toBe(' ');

	for (let i = 0; i < randomCypherText.length; i++) {
		let currentChar = randomCypherText.charAt(i);
		for (let j = i + 1; j < randomCypherText.length; j++) {
			let currentCompareChar = randomCypherText.charAt(j);
			let bothSpaces = currentChar === ' ' && currentCompareChar === ' ';
			let firstAndLast = i === 0 && j === 8;
			expect(currentChar === currentCompareChar).toBe(firstAndLast || bothSpaces);
		}
	}
});
