import Challenge from '../../models/challenge.model';
import Player from '../../models/player.model';
import '../../extensions/array';

const type = 'stacks';
const MAX_ROUND = 3;
const AMOUNTS = [ 5, 3, 1, -1, -3, -5 ];

interface Pile {
	player: Player;
	amount: number;
	numSelected: number;
}

export default class StacksChallenge extends Challenge {
	currentRound: number;
	piles: { [id: string]: Pile };

	constructor(players, title, description, questions) {
		super(players, title, description, 6, 6, questions, 'game', [], type);

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

		for (let key of Object.keys(dict)) {
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
		this.piles = {};

		let tempAmounts = JSON.parse(JSON.stringify(AMOUNTS));
		tempAmounts.shuffle();
		for (let i = 0; i < this.players.length; i++) {
			let player = this.players[i];
			let pile = { player: this.players[i], amount: tempAmounts[i], numSelected: 0 };
			this.piles[player.name] = pile;
		}
	}

	selectNumberOfTilesForPlayer(playerName: string, numTilesSelected: number) {
		this.piles[playerName].numSelected = numTilesSelected;
	}
}
