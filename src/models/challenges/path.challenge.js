import Challenge from './challenge.model';

import challengeData from './challenge.data'; // Lang?
import ArrayUtilsService from '../../services/utils/array-utils.service';

const type = 'path';
const possibleValues = [
	'exemption',
	'black-exemption',
	'a joker',
	'two jokers',
	'three jokers',
	'minus 3 points',
	'minus 5 points'
];

export default class PathChallenge extends Challenge {
	get contentsOfChosenChest() {
		return this.chests[this.currentChestIndex][this.currentChoice];
	}

	get walkerIsDone() {
		return this.currentChestIndex >= this.chests.length;
	}

	get majorityVote() {
		let majorityCount = (this.players.length - 1) / 2;
		if (this.votes.left.length > majorityCount) {
			return 'left';
		} else if (this.votes.right.length > majorityCount) {
			return 'right';
		} else {
			return null;
		}
	}

	constructor(players) {
		let { title, description, maxPlayers, minPlayers, questions, initialState } = challengeData[type];
		super(title, type, description, maxPlayers, minPlayers, questions, initialState);

		this.players = players;
		this.walkers = players;

		this.setNewWalker();
	}

	chooseLeft() {
		this.currentChoice = 'left';
	}

	chooseRight() {
		this.currentChoice = 'right';
	}

	get contentsOfChosenChest() {
		return this.chests[0][this.currentChoice];
	}

	addLeftVote() {
		this.votes[0]++;
	}

	removeLeftVote() {
		this.votes[0]--;
	}

	addRightVote() {
		this.votes[1]++;
	}

	removeRightVote() {
		this.votes[1]--;
	}

	get leftVotes() {
		return this.votes[0];
	}

	get rightVotes() {
		return this.votes[1];
	}

	setNewWalker() {
		this.votes = [ 0, 0 ];
		this.chests = [];
		this.currentWalker = ArrayUtilsService.getRandomElement(this.walkers);
		this.walkers = ArrayUtilsService.removeElementByValue(this.walkers, this.currentWalker);
		this.currentChoice = null;

		let tempValues = ArrayUtilsService.shuffleArray(possibleValues);
		for (let i = 0; i < 5; i++) {
			let value = tempValues.pop();
			let isLeftChest = Math.floor(Math.random() * 2);
			let chestRow = { left: 'continue', right: 'continue' };

			if (isLeftChest) {
				chestRow.left = value;
			} else {
				chestRow.right = value;
			}

			this.chests.push(chestRow);
		}
	}
}
