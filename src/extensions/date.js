export default function dateExtensions() {
	Date.minutesFromNow = function(minutes) {
		let date = new Date(Date.now() + minutes * 60 * 1000);
		return date.getTime();
	};

	Date.fiveMinutesFromNow = function() {
		return Date.minutesFromNow(5);
	};

	Date.tenMinutesFromNow = function() {
		return Date.minutesFromNow(10);
	};
}
