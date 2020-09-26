import RoomControllerCreator from '../room.controller';
import WebSocketServiceCreator from '../../services/websocket.service';

class PlatterChallengeControllerInstance {
	constructor() {}

	chooseExemption({ roomcode, player }) {
		let event = 'take-exemption';
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event);
		RoomControllerCreator.getInstance().giveObjectsToPlayer(roomcode, player, 'exemption', 1);
		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'took-exemption');
	}

	chooseMoney({ roomcode }) {
		let event = 'take-money';
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event);
		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'took-money');
	}

	setupSocket(socket) {
		socket.on('platter-choose-exemption', this.chooseExemption);
		socket.on('platter-choose-money', this.chooseMoney);
	}
}

export default class PlatterChallengeController {
	constructor() {}

	static getInstance() {
		if (!PlatterChallengeController.instance) {
			PlatterChallengeController.instance = new PlatterChallengeControllerInstance();
		}

		return PlatterChallengeController.instance;
	}
}
