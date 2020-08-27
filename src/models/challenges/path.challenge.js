import Challenge from './challenge.model';

import challengeData from './challenge.data'; // Lang?
import ArrayUtilsService from '../../services/utils/array-utils.service';

export const PATH_CHALLENGE_EVENTS = {
	CHOOSE_LEFT: 'chooseLeft',
	CHOOSE_RIGHT: 'chooseRight',
	ADD_LEFT_VOTE: 'addLeftVote',
	ADD_RIGHT_VOTE: 'addRightVote',
	MOVE_TO_NEW_ROW: 'moveToNewRow',
	SET_NEW_WALKER: 'setNewWalker'
};

export const PATH_CHALLENGE_STATES = {
	WALKER_CHOOSING: 'walkerChoosing',
	NON_WALKERS_VOTING: 'nonWalkersChoosing'
};

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

	get hasMajorityVote() {
		let majorityCount = (this.players.length - 1) / 2;
		return (
			this.votes.left.length !== this.votes.right.length &&
			(this.votes.left.length > majorityCount || this.votes.right.length > majorityCount)
		);
	}

	get challengeIsDone() {
		return !this.walkers.length && !this.currentWalker;
	}

	constructor(room) {
		let { title, description, maxPlayers, minPlayers, questions, initialState } = challengeData.find(
			(c) => c.type === type
		);
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
		if (!this.currentWalker || player.name === this.currentWalker.name) {
			return;
		}

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
		this.state = PATH_CHALLENGE_STATES.WALKER_CHOOSING;

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

	moveNext() {
		switch (this.state) {
			case PATH_CHALLENGE_STATES.WALKER_CHOOSING:
				this.state = PATH_CHALLENGE_STATES.NON_WALKERS_VOTING;
				break;
			case PATH_CHALLENGE_STATES.NON_WALKERS_VOTING:
				this.state = PATH_CHALLENGE_STATES.WALKER_CHOOSING;
				break;
			default:
				super.moveNext();
				break;
		}
	}
}
