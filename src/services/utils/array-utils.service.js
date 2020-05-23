class ArrayUtilsService {
	constructor() {}

	static shuffleArray(array) {
		if (array.length < 2) return array;

		for (let i = 0; i < array.length; i++) {
			let r = Math.floor(Math.random() * array.length);

			[ array[i], array[r] ] = [ array[r], array[i] ];
		}

		return array;
	}

	static removeElementAt(array, index) {
		return array.filter((element) => array.indexOf(element) !== index);
	}

	static removeElementByValue(array, oldElement) {
		return array.filter((element) => element !== oldElement);
	}
}
