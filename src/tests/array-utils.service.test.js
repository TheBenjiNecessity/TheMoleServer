import ArrayUtilsService from '../services/utils/array-utils.service';

test('Checks shuffleArray method', () => {
	let unshuffledArray = [ 1, 2, 3, 4, 5, 6 ];
	let array = ArrayUtilsService.shuffleArray(unshuffledArray);
	expect(array.length).toBe(6);
	for (let number of array) {
		expect(unshuffledArray.indexOf(number) >= 0).toBe(true);
	}
});

test('Checks getRandomElement method', () => {
	let array = [ 1, 2, 3, 4, 5, 6 ];
	let randomElement = ArrayUtilsService.getRandomElement(array);
	expect(typeof randomElement).toBe('number');
	expect(randomElement >= 1).toBe(true);
	expect(randomElement <= 6).toBe(true);
});

test('Checks removeElementAt method', () => {
	let array = [ 1, 2, 3, 4, 5, 6 ];
	let newArray = ArrayUtilsService.removeElementAt(array, 0);
	expect(newArray[0]).toBe(2);
	expect(newArray[1]).toBe(3);
	expect(newArray[2]).toBe(4);
	expect(newArray[3]).toBe(5);
	expect(newArray[4]).toBe(6);
});

test('Checks removeElementByValue method', () => {
	let array = [ 4, 3, 2, 7, 5, 4 ];
	let newArray = ArrayUtilsService.removeElementByValue(array, 7);
	expect(newArray[0]).toBe(4);
	expect(newArray[1]).toBe(3);
	expect(newArray[2]).toBe(2);
	expect(newArray[3]).toBe(5);
	expect(newArray[4]).toBe(4);

	let array2 = [ 4, 3, 2, 7, 5, 4 ];
	let newArray2 = ArrayUtilsService.removeElementByValue(array2, 4);
	expect(newArray2[0]).toBe(3);
	expect(newArray2[1]).toBe(2);
	expect(newArray2[2]).toBe(7);
	expect(newArray2[3]).toBe(5);
});

test('Checks getRandomElementNotInOtherArray method', () => {
	let bigArray = [ 4, 3, 2, 7, 5, 4 ];
	let currentArray = [ 3, 2, 7 ];
	let element = ArrayUtilsService.getRandomElementNotInOtherArray(bigArray, currentArray);
	expect(typeof element).toBe('number');
	expect([ 3, 2, 7 ].indexOf(element) < 0).toBe(true);
	expect(element === 4 || element === 5).toBe(true);
});
