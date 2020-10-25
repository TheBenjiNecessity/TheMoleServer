import RoomController from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';
import Room from '../room.model';

let rooms: { [id: string]: Room } = {};

export function getMockRoomController() {
	rooms = {};
	return new RoomController(
		new WebSocketService(null),
		[],
		() => rooms,
		(r) => {
			rooms = r;
		}
	);
}
