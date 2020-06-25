class LoggerServiceInstance {
	constructor() {}

	createLog(message) {
		let nowDate = new Date(Date.now());
		let output = `${nowDate.toDateString()} : ${message}`;
		console.log(output);
	}

	createLogWithObject(obj) {
		let nowDate = new Date(Date.now());
		let output = `${nowDate.toDateString()} : with obj:`;
		console.log(output, obj);
	}
}

export default class LoggerService {
	constructor() {}

	static getInstance() {
		if (!LoggerService.instance) {
			LoggerService.instance = new LoggerServiceInstance();
		}

		return LoggerService.instance;
	}

	static log(message) {
		this.getInstance().createLog(message);
	}

	static logWithObj(obj) {
		this.getInstance().createLogWithObject(obj);
	}
}
