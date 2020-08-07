import RoomControllerCreator from '../room.controller';
import WebSocketServiceCreator from '../../services/websocket.service';

export default class PlatterChallengeController {
	constructor() {}

	chooseExemption({ roomcode, player }) {
		let event = 'take-exemption';
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, {});
		RoomControllerCreator.getInstance().giveObjectsToPlayer(roomcode, player, 'exemption', 1);
		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'took-exemption', room);
	}

	chooseMoney({ roomcode }) {
		let event = 'take-money';
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, {});
		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'took-money', room);
	}

	setupSocket(socket) {
		socket.on('platter-choose-exemption', this.chooseExemption);
		socket.on('platter-choose-money', this.chooseMoney);
	}
}
