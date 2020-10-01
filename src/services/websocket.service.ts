export default class WebSocketService {
	constructor(private socketObj: any) {}

	sendToRoom(room, action) {
		if (this.socketObj) {
			this.socketObj.in(room.roomcode).emit(action, room);
		}

		return { room, action };
	}
}
