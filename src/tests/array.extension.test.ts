import '../extensions/array';

test('Checks getRandomElement method', () => {
	let array = [ 1, 2, 3, 4, 5, 6 ];
	let randomElement = array.getRandomElement();
	expect(typeof randomElement).toBe('number');
	expect(randomElement >= 1).toBe(true);
	expect(randomElement <= 6).toBe(true);
});

test('Checks removeElementAtIndex method', () => {
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

test('Checks randomIndex method', () => {
	let array = [ 4, 3, 2, 7, 5, 4 ];
	let randomIndex = array.randomIndex();
	expect(typeof randomIndex).toBe('number');
	expect(randomIndex >= 0).toBe(true);
	expect(randomIndex <= 5).toBe(true);
});

test('Checks removeRandomElement method', () => {
	let array = [ 4, 4, 4, 4, 4 ];
	let randomElement = array.removeRandomElement();
	expect(array.length).toBe(4);
	expect(randomElement).toBe(4);
});

test('Checks range method', () => {
	let rangeArray = Array.range(5, 1);
	expect(rangeArray.length).toBe(5);
	expect(rangeArray).toEqual([ 1, 2, 3, 4, 5 ]);

	rangeArray = Array.range(5);
	expect(rangeArray.length).toBe(6);
	expect(rangeArray).toEqual([ 0, 1, 2, 3, 4, 5 ]);
});
