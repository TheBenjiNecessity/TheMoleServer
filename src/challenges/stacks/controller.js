import RoomControllerCreator from '../room.controller';
import WebSocketService from '../../services/websocket.service';

class StacksChallengeControllerInstance {
	constructor() {}

	// releasedButton({ roomcode, playerName }) {
	// 	let event = 'take-exemption';
	// 	let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, {});
	// 	RoomControllerCreator.getInstance().giveObjectsToPlayer(roomcode, player, 'exemption', 1);
	// 	return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'took-exemption', room);
	// }

	// touchedButton({ roomcode, playerName }) {
	// 	let event = 'take-money';
	// 	let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, {});
	// 	return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'took-money', room);
	// }

	setupSocket(socket) {
		socket.on('button-released-button', this.releasedButton);
		socket.on('button-touched-button', this.touchedButton);
	}
}

export default class StacksChallengeController {
	constructor() {}

	static getInstance() {
		if (!StacksChallengeController.instance) {
			StacksChallengeController.instance = new StacksChallengeControllerInstance();
		}

		return StacksChallengeController.instance;
	}
}
