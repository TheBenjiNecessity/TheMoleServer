import Challenge from '../../models/challenge.model';
import Player from '../../models/player.model';
import '../../extensions/array';

import * as _ from 'lodash';

const type = 'stacks';
const MAX_ROUND = 3;
const AMOUNTS = [ 5, 3, 1, -1, -3, -5 ];

export interface Pile {
	player: Player;
	amount: number;
	numSelected: number;
}

export interface IPilesGenerator {
	generatePiles(players: Player[]): { [id: string]: Pile };
}

class PilesGenerator implements IPilesGenerator {
	constructor() {}

	generatePiles(players: Player[]): { [id: string]: Pile } {
		let piles: { [id: string]: Pile } = {};
		let tempAmounts = JSON.parse(JSON.stringify(AMOUNTS));

		tempAmounts = _.shuffle(tempAmounts);
		for (let i = 0; i < players.length; i++) {
			let player = players[i];
			let pile = { player: players[i], amount: tempAmounts[i], numSelected: 0 };
			piles[player.name] = pile;
		}

		return piles;
	}
}

export default class StacksChallenge extends Challenge {
	currentRound: number;
	piles: { [id: string]: Pile };

	constructor(players, questions, private pilesGenerator: IPilesGenerator = new PilesGenerator()) {
		super(players, questions, 'game');

		this.currentRound = 1;

		this.resetPiles();
	}

	get allStackAmountsSelected(): boolean {
		for (let player of this.players) {
			if (this.piles[player.name].numSelected === 0) {
				return false;
			}
		}

		return true;
	}

	get pointsForRound(): number {
		if (!this.allStackAmountsSelected) {
			return 0;
		}

		let result = 0;
		let dict: { [id: string]: Pile[] } = {};

		for (let player of this.players) {
			let pile = this.piles[player.name];
			if (!dict[pile.numSelected.toString()]) {
				dict[pile.numSelected.toString()] = [];
			}

			dict[pile.numSelected.toString()].push(pile);
		}

		for (let key in dict) {
			if (dict[key].length === 1) {
				result += dict[key][0].amount;
			}
		}

		return result;
	}

	get isChallengeOver(): boolean {
		return this.currentRound > MAX_ROUND;
	}

	goToNextRound() {
		this.currentRound++;
		this.resetPiles();
	}

	resetPiles() {
		this.piles = this.pilesGenerator.generatePiles(this.players);
	}

	selectNumberOfTilesForPlayer(playerName: string, numTilesSelected: number) {
		if (numTilesSelected > 3) {
			numTilesSelected = 3;
		} else if (numTilesSelected < 1) {
			numTilesSelected = 1;
		}

		this.piles[playerName].numSelected = numTilesSelected;
	}
}
