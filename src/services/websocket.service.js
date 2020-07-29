class WebSocketService {
	constructor() {}

	init(io, roomHandler) {
		this.io = io;

		this.io.on('connection', (socket) => {
			socket.on('join', (roomcode) => {
				if (roomcode) {
					socket.join(roomcode);
				}
			});

			roomHandler.setupSocket(socket);
		});
	}

	sendToRoom(roomcode, action, obj) {
		this.io.in(roomcode).emit(action, obj);
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
