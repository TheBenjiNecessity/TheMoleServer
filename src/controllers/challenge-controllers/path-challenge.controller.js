import RoomControllerCreator from '../room.controller';
import WebSocketServiceCreator from '../../services/websocket.service';

const POINTS_FOR_CONTINUING = 7;

class PathChallengeController {
	constructor() {}

	chooseChest({ roomcode, choice }) {
		let event = 'choose-' + choice;
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, {});
		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'path-choose-chest', room);
	}

	addVoteForChest({ roomcode, player, choice }) {
		let event = 'add-' + choice + '-vote';
		let obj = { player };
		let instance = RoomControllerCreator.getInstance();
		let room = instance.performEventOnChallenge(roomcode, event, obj);
		let wsMessage = 'path-vote-chest';

		let pathChallenge = room.currentChallenge;
		if (pathChallenge.majorityVote) {
			let { contentsOfChosenChest } = pathChallenge;

			if (contentsOfChosenChest === 'continue') {
				instance.performEventOnChallenge(roomcode, 'move-to-new-row', obj);

				if (pathChallenge.walkerIsDone) {
					instance.addPoints(roomcode, POINTS_FOR_CONTINUING);
				}

				wsMessage = 'walker-continued';
			} else {
				switch (contentsOfChosenChest) {
					case 'exemption':
					case 'black-exemption':
					case 'joker':
						instance.giveObjectsToPlayer(roomcode, player.name, contentsOfChosenChest, 1);
						wsMessage = 'walker-got-' + contentsOfChosenChest;
						break;
					case 'two jokers':
						instance.giveObjectsToPlayer(roomcode, player.name, 'joker', 2);
						wsMessage = 'walker-got-' + contentsOfChosenChest;
						wsMessage.replace(' ', '-');
						break;
					case 'three jokers':
						instance.giveObjectsToPlayer(roomcode, player.name, 'joker', 3);
						wsMessage = 'walker-got-' + contentsOfChosenChest;
						wsMessage.replace(' ', '-');
						break;
					case 'minus 3 points':
						instance.removePoints(roomcode, 3);
						wsMessage = 'walker-lost-three-points';
						break;
					case 'minus 5 points':
						instance.removePoints(roomcode, 5);
						wsMessage = 'walker-lost-five-points';
						break;
					default:
						break;
				}
			}
		}

		room = instance.getRoom(roomcode);
		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, wsMessage, room);
	}

	setupSocket(socket) {
		socket.on('path-choose-chest', this.chooseChest);
		socket.on('path-add-vote-chest', this.addVoteForChest);
	}
}

export default class PathChallengeControllerCreator {
	constructor() {}

	static getInstance() {
		if (!PathChallengeControllerCreator.instance) {
			PathChallengeControllerCreator.instance = new PathChallengeController();
		}

		return PathChallengeControllerCreator.instance;
	}
}
