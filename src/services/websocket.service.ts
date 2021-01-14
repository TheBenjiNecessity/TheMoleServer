import Room from '../models/room.model';

export default class WebSocketService {
	constructor(private socketObj: any) {}

	sendToRoom(room: Room, action: string = 'room-event') {
		if (this.socketObj) {
			this.socketObj.in(room.roomcode).emit(action, room);
		}

		return { room, action };
	}
}
