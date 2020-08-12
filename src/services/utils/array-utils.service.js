export default class ArrayUtilsService {
	constructor() {}

	static shuffleArray(array) {
		if (array.length < 2) return array;

		for (let i = 0; i < array.length; i++) {
			let r = Math.floor(Math.random() * array.length);

			[ array[i], array[r] ] = [ array[r], array[i] ];
		}

		return array;
	}

	static getRandomElement(array) {
		let r = Math.floor(Math.random() * array.length);
		return array[r];
	}

	static getRandomIndex(array) {
		return Math.floor(Math.random() * array.length);
	}

	static removeElementAt(array, index) {
		return array.filter((element) => array.indexOf(element) !== index);
	}

	static removeElementByValue(array, oldElement) {
		return array.filter((element) => element !== oldElement);
	}

	static getRandomElementNotInOtherArray(fullArray, otherArray) {
		let intersection = fullArray.filter((value) => !otherArray.includes(value));
		return this.getRandomElement(intersection);
	}

	static array2dTo1d(array2d) {
		return [].concat(...array2d);
	}
}
