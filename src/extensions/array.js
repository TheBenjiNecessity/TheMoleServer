export default function arrayExtensions() {
	Array.prototype.randomIndex = function() {
		return Math.floor(Math.random() * this.length);
	};

	Array.prototype.removeElementAtIndex = function(index) {
		return this.splice(index, 1)[0];
	};

	Array.prototype.removeElementByValue = function(element) {
		let index = this.indexOf(element);

		if (index < 0) {
			return null;
		}

		return this.splice(index, 1)[0];
	};

	Array.prototype.shuffle = function() {
		if (this.length < 2) return;

		for (let i = 0; i < this.length; i++) {
			let r = Math.floor(Math.random() * this.length);

			[ this[i], this[r] ] = [ this[r], this[i] ];
		}
	};

	Array.prototype.getRandomElement = function() {
		if (!this.length) {
			return null;
		}

		return this[this.randomIndex()];
	};

	Array.prototype.removeRandomElement = function() {
		if (!this.length) {
			return null;
		}

		return this.removeElementAtIndex(this.randomIndex());
	};
}
