export default function dateExtensions() {
	Date.prototype.minutesFromNow = function(minutes) {
		let date = new Date(date.getTime() + minutes * 60 * 1000);
		return date.getTime();
	};

	Date.prototype.fiveMinutesFromNow = function() {
		return Date.minutesFromNow(5);
	};

	Date.prototype.tenMinutesFromNow = function() {
		return Date.minutesFromNow(10);
	};
}
