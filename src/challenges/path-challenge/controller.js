import RoomControllerCreator from '../../controllers/room.controller';
import WebSocketServiceCreator from '../../services/websocket.service';
import { PATH_CHALLENGE_EVENTS } from './model';

const POINTS_FOR_CONTINUING = 7;

class PathChallengeControllerInstance {
	constructor() {}

	chooseChest({ roomcode, choice }) {
		let event = choice === 'left' ? PATH_CHALLENGE_EVENTS.CHOOSE_LEFT : PATH_CHALLENGE_EVENTS.CHOOSE_RIGHT;
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, {});
		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'path-choose-chest', room);
	}

	addVoteForChest({ roomcode, player, choice }) {
		let event = choice === 'left' ? PATH_CHALLENGE_EVENTS.ADD_LEFT_VOTE : PATH_CHALLENGE_EVENTS.ADD_RIGHT_VOTE;
		let obj = { player };
		let instance = RoomControllerCreator.getInstance();
		let room = instance.performEventOnChallenge(roomcode, event, obj);
		let wsMessage = 'path-vote-chest';

		let pathChallenge = room.currentEpisode.currentChallenge;
		if (pathChallenge.majorityVote) {
			let { contentsOfChosenChest } = pathChallenge;

			if (contentsOfChosenChest === 'continue') {
				instance.performEventOnChallenge(roomcode, PATH_CHALLENGE_EVENTS.MOVE_TO_NEW_ROW, obj);
				wsMessage = 'walker-continued';

				if (pathChallenge.walkerIsDone) {
					instance.addPoints(roomcode, POINTS_FOR_CONTINUING);
					instance.performEventOnChallenge(roomcode, PATH_CHALLENGE_EVENTS.SET_NEW_WALKER);
					wsMessage = 'walker-done';
				}
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

				instance.performEventOnChallenge(roomcode, PATH_CHALLENGE_EVENTS.SET_NEW_WALKER);
			}
		}

		if (pathChallenge.challengeIsDone) {
			return instance.moveNext({ roomcode });
		} else {
			room = instance.getRoom(roomcode);
			return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, wsMessage, room);
		}
	}

	setupSocket(socket) {
		socket.on('path-choose-chest', this.chooseChest);
		socket.on('path-add-vote-chest', this.addVoteForChest);
	}
}

export default class PathChallengeController {
	constructor() {}

	static getInstance() {
		if (!PathChallengeController.instance) {
			PathChallengeController.instance = new PathChallengeControllerInstance();
		}

		return PathChallengeController.instance;
	}
}
