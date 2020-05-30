import { RoomHandlerCreator } from '../controllers/room.controller';

class WebSocketController {
	constructor(io) {
		this.callbacks = {};
		this.io = io;

		io.on('connection', (socket) => {
			socket.on('join', (data) => {
				if (data && data.room) {
				socket.join(data.room.roomcode);
				}
			});

			RoomHandlerCreator.getInstance().setupSocket(socket);
		});
	}

	addEvent(name, callback) {
		if (typeof callback === 'function') {
			this.socket.on(name, callback);
			return true;
		} else {
			return false;
		}
	}

	sendToRoom(roomcode, action, obj) {
		let jsonString = JSON.stringify(obj);
		this.io.to(roomcode).emit(action, jsonString);
	}
}

export class WebSocketControllerCreator {
	constructor() {}

	static createController(io) {
		if (!WebSocketControllerCreator.instance) {
			WebSocketControllerCreator.instance = new WebSocketController(io);
		}

		return WebSocketControllerCreator.instance;
	}
}
