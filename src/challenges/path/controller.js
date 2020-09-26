import RoomController from '../../controllers/room.controller';
import WebSocketServiceCreator from '../../services/websocket.service';
import { PATH_CHALLENGE_EVENTS } from './model';

const POINTS_FOR_CONTINUING = 7;

class PathChallengeControllerInstance {
	constructor(roomControllerInstance, websocketServiceInstance) {
		this.roomControllerInstance = roomControllerInstance;
		this.websocketServiceInstance = websocketServiceInstance;
	}

	chooseChest({ roomcode, choice }) {
		let event = choice === 'left' ? PATH_CHALLENGE_EVENTS.CHOOSE_LEFT : PATH_CHALLENGE_EVENTS.CHOOSE_RIGHT;
		RoomController.getInstance().performEventOnChallenge(roomcode, event);
		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'path-choose-chest');
	}

	addVoteForChest({ roomcode, player, choice }) {
		let event = choice === 'left' ? PATH_CHALLENGE_EVENTS.ADD_LEFT_VOTE : PATH_CHALLENGE_EVENTS.ADD_RIGHT_VOTE;
		let room = this.roomControllerInstance().performEventOnChallenge(roomcode, event, player);
		let wsMessage = 'path-vote-chest';

		let pathChallenge = room.currentEpisode.currentChallenge;
		if (pathChallenge.majorityVote) {
			let { contentsOfChosenChest } = pathChallenge;

			if (contentsOfChosenChest === 'continue') {
				this.roomControllerInstance().performEventOnChallenge(
					roomcode,
					PATH_CHALLENGE_EVENTS.MOVE_TO_NEW_ROW,
					player
				);
				wsMessage = 'walker-continued';

				if (pathChallenge.walkerIsDone) {
					this.roomControllerInstance().addPoints(roomcode, POINTS_FOR_CONTINUING);
					this.roomControllerInstance().performEventOnChallenge(
						roomcode,
						PATH_CHALLENGE_EVENTS.SET_NEW_WALKER
					);
					wsMessage = 'walker-done';
				}
			} else {
				switch (contentsOfChosenChest) {
					case 'exemption':
					case 'black-exemption':
					case 'joker':
						this.roomControllerInstance().giveObjectsToPlayer(
							roomcode,
							player.name,
							contentsOfChosenChest,
							1
						);
						wsMessage = 'walker-got-' + contentsOfChosenChest;
						break;
					case 'two jokers':
						this.roomControllerInstance().giveObjectsToPlayer(roomcode, player.name, 'joker', 2);
						wsMessage = 'walker-got-' + contentsOfChosenChest;
						wsMessage.replace(' ', '-');
						break;
					case 'three jokers':
						this.roomControllerInstance().giveObjectsToPlayer(roomcode, player.name, 'joker', 3);
						wsMessage = 'walker-got-' + contentsOfChosenChest;
						wsMessage.replace(' ', '-');
						break;
					case 'minus 3 points':
						this.roomControllerInstance().removePoints(roomcode, 3);
						wsMessage = 'walker-lost-three-points';
						break;
					case 'minus 5 points':
						this.roomControllerInstance().removePoints(roomcode, 5);
						wsMessage = 'walker-lost-five-points';
						break;
					default:
						break;
				}

				this.roomControllerInstance().performEventOnChallenge(roomcode, PATH_CHALLENGE_EVENTS.SET_NEW_WALKER);
			}
		}

		if (pathChallenge.challengeIsDone) {
			return this.roomControllerInstance().moveNext({ roomcode });
		} else {
			room = this.roomControllerInstance().getRoom(roomcode);
			return this.websocketServiceInstance().sendToRoom(roomcode, wsMessage);
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
			PathChallengeController.instance = new PathChallengeControllerInstance(
				() => RoomController.getInstance(),
				() => WebSocketServiceCreator.getInstance()
			);
		}

		return PathChallengeController.instance;
	}
}
