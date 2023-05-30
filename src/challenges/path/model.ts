import Challenge from '../../models/challenge.model';
import Player from '../../models/player.model';
import '../../extensions/array';

import * as _ from 'lodash';

const MAX_CHESTS = 5;

export const PATH_CHALLENGE_EVENTS = {
	CHOOSE_LEFT: 'chooseLeft',
	CHOOSE_RIGHT: 'chooseRight',
	ADD_LEFT_VOTE: 'addLeftVote',
	ADD_RIGHT_VOTE: 'addRightVote',
	MOVE_TO_NEW_ROW: 'moveToNewRow',
	SET_NEW_WALKER: 'setNewWalker'
};

const PATH_CHALLENGE_STATES = {
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

export interface Chest {
	left: string;
	right: string;
}

export interface Votes {
	left: Player[];
	right: Player[];
}

export interface IWalkersGenerator {
	getNewWalker(players: Player[]): Player;
}

class WalkersGenerator implements IWalkersGenerator {
	constructor() {}

	getNewWalker(players: Player[]): Player {
		return players.getRandomElement();
	}
}

export interface IChestsGenerator {
	getChests(possibleValues: string[]): Chest[];
}

class ChestsGenerator implements IChestsGenerator {
	constructor() {}

	getChests(possibleValues: string[]): Chest[] {
		let returnedChests: Chest[] = [];
		possibleValues = _.shuffle(possibleValues);

		for (let i = 0; i < MAX_CHESTS; i++) {
			let value = possibleValues.pop();
			let isLeftChest = Math.floor(Math.random() * 2);
			let chestRow = { left: 'continue', right: 'continue' };

			if (isLeftChest) {
				chestRow.left = value;
			} else {
				chestRow.right = value;
			}

			returnedChests.push(chestRow);
		}
		return returnedChests;
	}
}

export default class PathChallenge extends Challenge {
	players: Player[];
	walkers: Player[];
	currentWalker: Player;
	votes: Votes;
	chests: Chest[];
	currentChestIndex: number;
	currentChoice: string;

	constructor(
		players,
		questions,
		private walkerGenerator: IWalkersGenerator = new WalkersGenerator(),
		private chestsGenerator: IChestsGenerator = new ChestsGenerator()
	) {
		super(players, questions, 'walker');

		this.players = players;
		this.walkers = JSON.parse(JSON.stringify(this.players));

		this.setNewWalker();
	}

	get currentChest() {
		return this.chests[this.currentChestIndex];
	}

	get contentsOfChosenChest() {
		return this.currentChest[this.currentChoice];
	}

	get contentsOfVotedChest() {
		if (this.majorityVote) {
			return this.currentChest[this.majorityVote];
		}
		return null;
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

	get majorityVote() {
		if (this.hasMajorityVote) {
			return this.votes.left > this.votes.right ? 'left' : 'right';
		}

		return null;
	}

	get challengeIsDone() {
		return !this.walkers.length && !this.currentWalker;
	}

	get playersNotWalker() {
		return this.players.filter((p) => p.name !== this.currentWalker.name);
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
		if (!this.currentWalker || player.name === this.currentWalker.name || this.currentChoice === null) {
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
		this.currentWalker = this.walkerGenerator.getNewWalker(this.walkers);
		this.walkers.removeElementByValue(this.currentWalker);
		this.currentChoice = null;
		this.currentChestIndex = 0;
		this.state = PATH_CHALLENGE_STATES.WALKER_CHOOSING;
		this.chests = this.chestsGenerator.getChests(possibleValues);
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
