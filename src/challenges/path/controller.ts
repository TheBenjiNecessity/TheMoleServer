import RoomController from '../../controllers/room.controller';
import { PATH_CHALLENGE_EVENTS } from './model';
import Controller from '../../interfaces/controller';
import ChallengeController from '../../controllers/challenge.controller';
import Player from '../../models/player.model';

const POINTS_FOR_CONTINUING = 7;

export default class PathChallengeControllerInstance extends Controller {
	constructor(protected roomController: RoomController, protected challengeController: ChallengeController) {
		super(roomController);
	}

	chooseChest(roomcode: string, choice: string) {
		let event = choice === 'left' ? PATH_CHALLENGE_EVENTS.CHOOSE_LEFT : PATH_CHALLENGE_EVENTS.CHOOSE_RIGHT;
		this.roomController.performEventOnChallenge(roomcode, event);
		return 'path-choose-chest';
	}

	addVoteForChest(roomcode: string, player: Player, choice: string) {
		let event = choice === 'left' ? PATH_CHALLENGE_EVENTS.ADD_LEFT_VOTE : PATH_CHALLENGE_EVENTS.ADD_RIGHT_VOTE;
		let room = this.roomController.performEventOnChallenge(roomcode, event, player);
		let message = 'path-vote-chest';

		let pathChallenge = room.currentEpisode.currentChallenge;
		if (pathChallenge.majorityVote) {
			let { contentsOfChosenChest } = pathChallenge;

			if (contentsOfChosenChest === 'continue') {
				this.roomController.performEventOnChallenge(roomcode, PATH_CHALLENGE_EVENTS.MOVE_TO_NEW_ROW, player);
				message = 'walker-continued';

				if (pathChallenge.walkerIsDone) {
					this.roomController.addPoints(roomcode, POINTS_FOR_CONTINUING);
					this.roomController.performEventOnChallenge(roomcode, PATH_CHALLENGE_EVENTS.SET_NEW_WALKER);
					message = 'walker-done';
				}
			} else {
				switch (contentsOfChosenChest) {
					case 'exemption':
					case 'black-exemption':
					case 'joker':
						this.roomController.giveObjectsToPlayer(roomcode, player.name, contentsOfChosenChest, 1);
						message = 'walker-got-' + contentsOfChosenChest;
						break;
					case 'two jokers':
						this.roomController.giveObjectsToPlayer(roomcode, player.name, 'joker', 2);
						message = 'walker-got-' + contentsOfChosenChest;
						message.replace(' ', '-');
						break;
					case 'three jokers':
						this.roomController.giveObjectsToPlayer(roomcode, player.name, 'joker', 3);
						message = 'walker-got-' + contentsOfChosenChest;
						message.replace(' ', '-');
						break;
					case 'minus 3 points':
						this.roomController.removePoints(roomcode, 3);
						message = 'walker-lost-three-points';
						break;
					case 'minus 5 points':
						this.roomController.removePoints(roomcode, 5);
						message = 'walker-lost-five-points';
						break;
					default:
						break;
				}

				this.roomController.performEventOnChallenge(roomcode, PATH_CHALLENGE_EVENTS.SET_NEW_WALKER);
			}
		}

		if (pathChallenge.challengeIsDone) {
			this.roomController.moveNext(roomcode);
		}

		return message;
	}
}
