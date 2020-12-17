import RoomController from '../../controllers/room.controller';
import ChallengeData from '../../interfaces/challenge-data';
import WebSocketService from '../websocket.service';
import Room from '../../models/room.model';

let rooms: { [id: string]: Room } = {};

export function getMockRoomController(challengeData: ChallengeData[] = []) {
	rooms = {};
	return new RoomController(
		new WebSocketService(null),
		challengeData,
		() => rooms,
		(r) => {
			rooms = r;
		}
	);
}
