export function createLog(roomcode: string, message: string, date: Date = new Date(Date.now())) {
	let output = `${date.toDateString()} : ${roomcode} : ${message}`;
	console.log(output);
}
