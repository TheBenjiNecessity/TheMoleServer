import RoomController from '../../controllers/room.controller';
import ChallengeData from '../../interfaces/challenge-data';
import WebSocketService from '../websocket.service';
import Room from '../../models/room.model';

let rooms: { [id: string]: Room } = {};

export function getMockRoomController(challengeData: ChallengeData[] = []) {
	rooms = {};
	const roomController = new RoomController(
		new WebSocketService(null),
		challengeData,
		() => rooms,
		(r) => {
			rooms = r;
		}
	);

	return roomController;
}

export function getMockRoomControllerWithRoom(room: Room, challengeData: ChallengeData[] = []) {
	rooms = {};

	const roomController = getMockRoomController(challengeData);
	roomController.setRoom(room);

	if (challengeData.length) {
		roomController.setChallengeDataForRoom(room.roomcode);
	}

	return roomController;
}
