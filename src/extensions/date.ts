export {};

declare global {
	interface DateConstructor {
		millisecondsFromNow: (milliseconds: number) => number;
		secondsFromNow: (seconds: number) => number;
		minutesFromNow: (minutes: number) => number;
		fiveMinutesFromNow: () => number;
		tenMinutesFromNow: () => number;
	}
}

Date.millisecondsFromNow = function(milliseconds) {
	let date = new Date(Date.now() + milliseconds);
	return date.getTime();
};

Date.secondsFromNow = function(seconds) {
	return Date.millisecondsFromNow(seconds * 1000);
};

Date.minutesFromNow = function(minutes) {
	return Date.secondsFromNow(minutes * 60);
};

Date.fiveMinutesFromNow = function() {
	return Date.minutesFromNow(5);
};

Date.tenMinutesFromNow = function() {
	return Date.minutesFromNow(10);
};
