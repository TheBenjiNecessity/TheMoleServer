import RoomControllerCreator from '../../controllers/room.controller';

class PlatterChallengeControllerInstance {
	constructor() {}

	chooseExemption(roomcode, player) {
		let event = 'take-exemption';
		RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event);
		RoomControllerCreator.getInstance().giveObjectsToPlayer(roomcode, player, 'exemption', 1);
		return 'took-exemption';
	}

	chooseMoney(roomcode) {
		let event = 'take-money';
		RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event);
		return 'took-money';
	}

	setupSocket(socket) {
		socket.on('platter-choose-exemption', this.chooseExemption);
		socket.on('platter-choose-money', this.chooseMoney);
	}
}

export default class PlatterChallengeController {
	static instance: PlatterChallengeControllerInstance;

	constructor() {}

	static getInstance() {
		if (!PlatterChallengeController.instance) {
			PlatterChallengeController.instance = new PlatterChallengeControllerInstance();
		}

		return PlatterChallengeController.instance;
	}
}
