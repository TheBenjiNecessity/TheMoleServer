import ChallengeController from '../controllers/challenge.controller';
import RoomController from '../controllers/room.controller';
import RoomSocketHandler from '../controllers/room.socket-handler';
import ChallengeService from './game/challenge.service';

class WebSocketServiceInstance {
	io: any;

	constructor() {}

	init(io) {
		this.io = io;

		this.io.on('connection', async (socket) => {
			socket.on('join', (roomcode) => {
				if (roomcode) {
					socket.join(roomcode);

					let room = RoomController.getInstance().getRoom(roomcode);

					if (room) {
						socket.emit('get-room', room);
					}
				}
			});

			RoomSocketHandler.getInstance().setupSocket(socket);
			ChallengeController.getInstance().setupSocket(socket);

			for (let challenge of RoomController.getInstance().challengeData) {
				let childInstance = await ChallengeService.getChallengeControllerForType(challenge.type);
				if (childInstance) {
					childInstance.setupSocket(socket);
				}
			}
		});
	}

	sendToRoom(roomcode, action) {
		if (this.io) {
			let room = RoomController.getInstance().getRoom(roomcode);
			this.io.in(roomcode).emit(action, room);
		}

		return { roomcode, action };
	}
}

export default class WebSocketService {
	static instance: WebSocketServiceInstance;

	constructor() {}

	static getInstance() {
		if (!WebSocketService.instance) {
			WebSocketService.instance = new WebSocketServiceInstance();
		}

		return WebSocketService.instance;
	}
}
