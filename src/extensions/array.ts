export {};

declare global {
	interface Array<T> {
		randomIndex(): number;
		removeElementAtIndex(index: number): Array<T>;
		removeElementByValue(element: any): Array<T>;
		shuffle(): void;
		getRandomElement(): T;
		removeRandomElement(): Array<T>;
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

Array.prototype.shuffle = function<T>(): void {
	if (this.length < 2) return;

	for (let i = 0; i < this.length; i++) {
		let r = Math.floor(Math.random() * this.length);

		[ this[i], this[r] ] = [ this[r], this[i] ];
	}
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
