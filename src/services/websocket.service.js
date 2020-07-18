class WebSocketService {
	constructor() {}

	static init(io, roomHandler) {
		WebSocketService.io = io;

		WebSocketService.io.on('connection', (socket) => {
			socket.on('join', (roomcode) => {
				if (roomcode) {
					socket.join(roomcode);
				}
			});

			roomHandler.setupSocket(socket);
		});
	}

	static sendToRoom(roomcode, action, obj) {
		WebSocketService.io.in(roomcode).emit(action, obj);
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
