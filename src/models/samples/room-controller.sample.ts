import RoomController from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';
import Room from '../room.model';

let rooms: { [id: string]: Room } = {};

export function getMockRoomController() {
	rooms = {};
	let webSocketService = new WebSocketService(null);
	return new RoomController(
		webSocketService,
		[],
		() => rooms,
		(r) => {
			rooms = r;
		}
	);
}
