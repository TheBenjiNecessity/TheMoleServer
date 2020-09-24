import RoomController from '../controllers/room.controller';

class WebSocketService {
	constructor() {}

	init(io, roomHandler) {
		this.io = io;

		//TODO send user the current room upon connection if possible
		this.io.on('connection', (socket) => {
			socket.on('join', (roomcode) => {
				if (roomcode) {
					socket.join(roomcode);
				}
			});

			roomHandler.setupSocket(socket);
		});
	}

	sendToRoom(roomcode, action) {
		let room = RoomController.getInstance().getRoom(roomcode);
		if (this.io) {
			this.io.in(roomcode).emit(action, room);
		}

		return { roomcode, action };
	}
}

export default class WebSocketServiceCreator {
	constructor() {}

	static getInstance() {
		if (!WebSocketServiceCreator.instance) {
			WebSocketServiceCreator.instance = new WebSocketService();
		}

		return WebSocketServiceCreator.instance;
	}
}
