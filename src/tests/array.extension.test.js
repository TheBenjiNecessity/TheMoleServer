import arrayExtensions from '../extensions/array';

arrayExtensions();

test('Checks shuffleArray method', () => {
	let unshuffledArray = [ 1, 2, 3, 4, 5, 6 ];
	unshuffledArray.shuffle();
	expect(unshuffledArray.length).toBe(6);
	for (let number of unshuffledArray) {
		expect(unshuffledArray.indexOf(number) >= 0).toBe(true);
	}
});

test('Checks getRandomElement method', () => {
	let array = [ 1, 2, 3, 4, 5, 6 ];
	let randomElement = array.getRandomElement();
	expect(typeof randomElement).toBe('number');
	expect(randomElement >= 1).toBe(true);
	expect(randomElement <= 6).toBe(true);
});

test('Checks removeElementAt method', () => {
	let array = [ 1, 2, 3, 4, 5, 6 ];
	array.removeElementAtIndex(0);
	expect(array[0]).toBe(2);
	expect(array[1]).toBe(3);
	expect(array[2]).toBe(4);
	expect(array[3]).toBe(5);
	expect(array[4]).toBe(6);
});

test('Checks removeElementByValue method', () => {
	let array = [ 4, 3, 2, 7, 5, 4 ];
	array.removeElementByValue(7);
	expect(array[0]).toBe(4);
	expect(array[1]).toBe(3);
	expect(array[2]).toBe(2);
	expect(array[3]).toBe(5);
	expect(array[4]).toBe(4);

	let array2 = [ 4, 3, 2, 7, 5, 4 ];
	array2.removeElementByValue(4);
	expect(array2[0]).toBe(3);
	expect(array2[1]).toBe(2);
	expect(array2[2]).toBe(7);
	expect(array2[3]).toBe(5);
});
