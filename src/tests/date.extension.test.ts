import '../extensions/date';
import { DateWrapper } from '../extensions/date';

const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;

test('Checks millisecondsFromNow method', () => {
	const timestamp: number = 1000000000000;
	const millisecondsFromNow: number = 10000;
	const fixedDate: Date = new Date(timestamp);
	let dateInMilliseconds: number = Date.millisecondsFromNow(10000, new DateWrapper(fixedDate));

	expect(dateInMilliseconds).toBe(timestamp + millisecondsFromNow);
});

test('Checks secondsFromNow method', () => {
	const timestamp: number = 1000000000000;
	const secondsFromNow: number = 10;
	const fixedDate: Date = new Date(timestamp);
	let dateInMilliseconds: number = Date.secondsFromNow(secondsFromNow, new DateWrapper(fixedDate));

	expect(dateInMilliseconds).toBe(timestamp + secondsFromNow * MILLISECONDS_IN_SECOND);
});

test('Checks minutesFromNow method', () => {
	const timestamp: number = 1000000000000;
	const minutesFromNow: number = 5;
	const fixedDate: Date = new Date(timestamp);
	let dateInMilliseconds: number = Date.minutesFromNow(minutesFromNow, new DateWrapper(fixedDate));

	expect(dateInMilliseconds).toBe(timestamp + minutesFromNow * MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE);
});

test('Checks fiveMinutesFromNow method', () => {
	const timestamp: number = 1000000000000;
	const minutesFromNow: number = 5;
	const fixedDate: Date = new Date(timestamp);
	let dateInMilliseconds: number = Date.fiveMinutesFromNow(new DateWrapper(fixedDate));

	expect(dateInMilliseconds).toBe(timestamp + minutesFromNow * MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE);
});

test('Checks tenMinutesFromNow method', () => {
	const timestamp: number = 1000000000000;
	const minutesFromNow: number = 10;
	const fixedDate: Date = new Date(timestamp);
	let dateInMilliseconds: number = Date.tenMinutesFromNow(new DateWrapper(fixedDate));

	expect(dateInMilliseconds).toBe(timestamp + minutesFromNow * MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE);
});
