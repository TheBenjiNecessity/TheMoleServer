import RoomController from '../../controllers/room.controller';
import ChallengeData from '../../interfaces/challenge-data';
import WebSocketService from '../../services/websocket.service';
import Room from '../room.model';

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
