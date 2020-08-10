import Challenge from './challenge.model';

import challengeData from './challenge.data'; // Lang?
import ArrayUtilsService from '../../services/utils/array-utils.service';

const type = 'path';
const possibleValues = [
	'exemption',
	'black-exemption',
	'joker',
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
		if (this.votes.left.length === this.votes.right.length) {
			return null;
		}

		let majorityCount = (this.players.length - 1) / 2;
		if (this.votes.left.length > majorityCount) {
			return 'left';
		} else if (this.votes.right.length > majorityCount) {
			return 'right';
		} else {
			return null;
		}
	}

	constructor(room) {
		let { title, description, maxPlayers, minPlayers, questions, initialState } = challengeData[type];
		super(room, title, type, description, maxPlayers, minPlayers, questions, initialState);

		this.players = room.players;
		this.walkers = this.players;

		this.setNewWalker();
	}

	chooseLeft() {
		this.currentChoice = 'left';
	}

	chooseRight() {
		this.currentChoice = 'right';
	}

	moveToNewRow() {
		return this.currentChestIndex++;
	}

	addLeftVote(player) {
		this.addVote(player, 'left');
	}

	addRightVote(player) {
		this.addVote(player, 'right');
	}

	addVote(player, direction) {
		let foundPlayerVote = this.votes[direction].find((p) => p.name === player.name);
		if (!foundPlayerVote) {
			this.removeVotesForPlayer(player);
			this.votes[direction].push(player);
		}
	}

	removeVotesForPlayer(player) {
		this.votes.left = this.votes.left.filter((p) => p.name !== player.name);
		this.votes.right = this.votes.right.filter((p) => p.name !== player.name);
	}

	setNewWalker() {
		this.votes = { left: [], right: [] };
		this.chests = [];
		this.currentWalker = ArrayUtilsService.getRandomElement(this.walkers);
		this.walkers = ArrayUtilsService.removeElementByValue(this.walkers, this.currentWalker);
		this.currentChoice = null;
		this.currentChestIndex = 0;

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

	performEvent(event, { player, role }) {
		switch (event) {
			case 'choose-left':
				this.chooseLeft();
				break;
			case 'choose-right':
				this.chooseRight();
				break;
			case 'add-left-vote':
				this.addLeftVote();
				break;
			case 'add-right-vote':
				this.addRightVote();
				break;
			case 'move-to-new-row':
				this.moveToNewRow();
				break;
			default:
				super.performEvent(event, { player, role });
				break;
		}
	}
}
