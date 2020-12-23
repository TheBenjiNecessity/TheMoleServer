import Challenge from '../../models/challenge.model';
import Player from '../../models/player.model';

const type = 'platter';

export default class PlatterChallenge extends Challenge {
	playerWhoTookExemption: Player;
	playersWhoTookMoney: Player[];

	constructor(players, title, description, questions) {
		super(players, title, description, questions, 'game');

		this.playerWhoTookExemption = null;
		this.playersWhoTookMoney = [];
	}

	get allMoneyWasTaken(): boolean {
		return this.playersWhoTookMoney.length === this.players.length;
	}

	takeExemption(playerName: string) {
		this.playerWhoTookExemption = this.players.find((p) => p.name === playerName);
	}

	takeMoney(playerName: string) {
		let player = this.players.find((p) => p.name === playerName);
		let foundPlayer = this.playersWhoTookMoney.find((p) => p && p.name === playerName);
		if (!foundPlayer) {
			this.playersWhoTookMoney.push(player);
		}
	}

	playerTookMoney(playerName: string): boolean {
		let foundPlayer = this.playersWhoTookMoney.find((p) => p && p.name === playerName);
		return typeof foundPlayer !== 'undefined';
	}
}
