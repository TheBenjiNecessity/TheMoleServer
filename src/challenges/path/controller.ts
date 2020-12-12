import RoomController from '../../controllers/room.controller';
import PathChallenge, { PATH_CHALLENGE_EVENTS } from './model';
import ChallengeController from '../../controllers/challenge.controller';
import Player from '../../models/player.model';
import { CHALLENGE_EVENTS } from '../../contants/challenge.constants';

const POINTS_FOR_CONTINUING = 7;

export default class PathChallengeController extends ChallengeController {
	constructor(protected roomController: RoomController) {
		super(roomController);
	}

	chooseChest(roomcode: string, choice: string) {
		let event = choice === 'left' ? PATH_CHALLENGE_EVENTS.CHOOSE_LEFT : PATH_CHALLENGE_EVENTS.CHOOSE_RIGHT;
		this.performEvent(roomcode, event);
		return 'path-choose-chest';
	}

	// TODO: what happens when hasMajorityVote is already true when this function is called
	// hasMajorityVote block of code called twice?
	addVoteForChest(roomcode: string, player: Player, choice: string) {
		let event = choice === 'left' ? PATH_CHALLENGE_EVENTS.ADD_LEFT_VOTE : PATH_CHALLENGE_EVENTS.ADD_RIGHT_VOTE;
		let room = this.performEvent(roomcode, event, player);
		let message = 'path-vote-chest';

		let pathChallenge = room.currentEpisode.currentChallenge as PathChallenge;
		if (pathChallenge.hasMajorityVote) {
			let { contentsOfVotedChest } = pathChallenge;

			if (contentsOfVotedChest === 'continue') {
				this.performEvent(roomcode, PATH_CHALLENGE_EVENTS.MOVE_TO_NEW_ROW, player);
				message = 'walker-continued';

				if (pathChallenge.walkerIsDone) {
					this.roomController.addPoints(roomcode, POINTS_FOR_CONTINUING);
					this.performEvent(roomcode, PATH_CHALLENGE_EVENTS.SET_NEW_WALKER);
					message = 'walker-done';
				}
			} else {
				switch (contentsOfVotedChest) {
					case 'exemption':
					case 'black-exemption':
					case 'joker':
						this.roomController.giveObjectsToPlayer(
							roomcode,
							pathChallenge.currentWalker.name,
							contentsOfVotedChest,
							1
						);
						message = 'walker-got-' + contentsOfVotedChest;
						break;
					case 'two jokers':
						this.roomController.giveObjectsToPlayer(roomcode, pathChallenge.currentWalker.name, 'joker', 2);
						message = 'walker-got-' + contentsOfVotedChest;
						message.replace(' ', '-');
						break;
					case 'three jokers':
						this.roomController.giveObjectsToPlayer(roomcode, pathChallenge.currentWalker.name, 'joker', 3);
						message = 'walker-got-' + contentsOfVotedChest;
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

				this.performEvent(roomcode, PATH_CHALLENGE_EVENTS.SET_NEW_WALKER);
			}
		}

		if (pathChallenge.challengeIsDone) {
			this.performEvent(roomcode, CHALLENGE_EVENTS.END_CHALLENGE);
		}

		return message;
	}

	stateDidChange() {}
}
