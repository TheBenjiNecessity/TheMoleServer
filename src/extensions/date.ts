declare global {
	interface DateConstructor {
		millisecondsFromNow: (milliseconds: number, dateWrapper?: DateWrapper) => number;
		secondsFromNow: (seconds: number, dateWrapper?: DateWrapper) => number;
		minutesFromNow: (minutes: number, dateWrapper?: DateWrapper) => number;
		fiveMinutesFromNow: (dateWrapper?: DateWrapper) => number;
		tenMinutesFromNow: (dateWrapper?: DateWrapper) => number;
	}
}

export class DateWrapper {
	private _date: Date;

	constructor(fixedDateTime: Date) {
		this._date = fixedDateTime;
	}

	get now(): number {
		return this._date ? this._date.getTime() : Date.now();
	}
}

Date.millisecondsFromNow = function(milliseconds, dateWrapper: DateWrapper = new DateWrapper(null)) {
	let date = new Date(dateWrapper.now + milliseconds);
	return date.getTime();
};

Date.secondsFromNow = function(seconds, dateWrapper: DateWrapper = new DateWrapper(null)) {
	return Date.millisecondsFromNow(seconds * 1000, dateWrapper);
};

Date.minutesFromNow = function(minutes, dateWrapper: DateWrapper = new DateWrapper(null)) {
	return Date.secondsFromNow(minutes * 60, dateWrapper);
};

Date.fiveMinutesFromNow = function(dateWrapper: DateWrapper = new DateWrapper(null)) {
	return Date.minutesFromNow(5, dateWrapper);
};

Date.tenMinutesFromNow = function(dateWrapper: DateWrapper = new DateWrapper(null)) {
	return Date.minutesFromNow(10, dateWrapper);
};
