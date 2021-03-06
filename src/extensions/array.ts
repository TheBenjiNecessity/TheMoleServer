export {};

declare global {
	interface ArrayConstructor {
		range(end: number, start: number): number[];
		range(end: number): number[];
	}

	interface Array<T> {
		randomIndex(): number;
		removeElementAtIndex(index: number): Array<T>;
		removeElementByValue(element: any): Array<T>;
		getRandomElement(): T;
		removeRandomElement(): Array<T>;
		range(start: number, end: number): number[];
	}
}

Array.prototype.randomIndex = function<T>(): number {
	return Math.floor(Math.random() * this.length);
};

Array.prototype.removeElementAtIndex = function<T>(index: number): T[] {
	return this.splice(index, 1)[0];
};

Array.prototype.removeElementByValue = function<T>(element: T): T[] {
	let index = this.indexOf(element);

	if (index < 0) {
		return null;
	}

	return this.splice(index, 1)[0];
};

Array.prototype.getRandomElement = function<T>(): T {
	if (!this.length) {
		return null;
	}

	return this[this.randomIndex()];
};

Array.prototype.removeRandomElement = function<T>(): T[] {
	if (!this.length) {
		return null;
	}

	return this.removeElementAtIndex(this.randomIndex());
};

Array.range = function(end: number, start: number = 0) {
	return new Array(end + 1 - start).fill(null).map((n, i) => i + start);
};
