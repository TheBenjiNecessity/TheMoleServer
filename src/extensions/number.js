export default function numberExtensions() {
	Number.prototype.unixTimeToSeconds = function() {
		return this / 1000;
	};

	Number.prototype.unixTimeToMinutes = function() {
		return this.unixTimeToSeconds / 60;
	};

	Number.prototype.unixTimeToHours = function() {
		return this.unixTimeToMinutes / 60;
	};
}