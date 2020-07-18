import ChallengeController from '../challenge.controller';
import RoomHandlerCreator from '../room.controller';
import WebSocketServiceCreator from '../../services/websocket.service';

export default class PlatterChallengeController extends ChallengeController {
	constructor() {}

	chooseExemption({ room, player }) {
		RoomHandlerCreator.getInstance().giveObjectsToPlayer(room.roomcode, player, 'exemption', 1);
		let newRoom = RoomHandlerCreator.getInstance().rooms[room.roomcode];
		WebSocketServiceCreator.getInstance().sendToRoom(room.roomcode, 'took-exemption', newRoom);
	}

	chooseMoney({ room, player }) {
		let newRoom = RoomHandlerCreator.getInstance().rooms[room.roomcode];
		WebSocketServiceCreator.getInstance().sendToRoom(room.roomcode, 'took-money', newRoom);
	}

	setupSocket(socket) {
		socket.on('platter-choose-exemption', this.chooseExemption);
		socket.on('platter-choose-money', this.chooseMoney);
	}
}
