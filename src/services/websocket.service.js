import { RoomHandlerCreator } from '../controllers/room.controller';

class WebSocketController {
	constructor(io) {
		this.callbacks = {};
		this.io = io;

		this.io.on('connection', (socket) => {
			socket.on('join', (roomcode) => {
				if (roomcode) {
					socket.join(roomcode);
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
		this.io.in(roomcode).emit(action, obj);
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
