export default class LoggerService {
	constructor() {}

	static createLog(message) {
		let nowDate = new Date(Date.now());
		let output = `${nowDate.toDateString()} : ${message}`;
		console.log(output);
	}

	static createLogWithObject(obj) {
		let nowDate = new Date(Date.now());
		let output = `${nowDate.toDateString()} : with obj:`;
		console.log(output, obj);
	}
}
