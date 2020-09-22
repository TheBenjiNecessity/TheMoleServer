import RoomControllerCreator from '../room.controller';
import WebSocketServiceCreator from '../../services/websocket.service';

class OutAndSafeChallengeControllerInstance {
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

export default class OutAndSafeChallengeController {
	constructor() {}

	static getInstance() {
		if (!OutAndSafeChallengeController.instance) {
			OutAndSafeChallengeController.instance = new OutAndSafeChallengeControllerInstance();
		}

		return OutAndSafeChallengeController.instance;
	}
}
