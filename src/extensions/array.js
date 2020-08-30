export default function arrayExtensions() {
	Array.prototype.shuffle = function() {
		if (this.length < 2) return this;

		for (let i = 0; i < this.length; i++) {
			let r = Math.floor(Math.random() * this.length);

			[ this[i], this[r] ] = [ this[r], this[i] ];
		}

		return this;
	};
}
