import Challenge from '../../models/challenge.model';

const type = 'platter';

export default class PlatterChallenge extends Challenge {
	constructor(players, title, description, maxPlayers, minPlayers, questions, initialState) {
		super(players, title, description, maxPlayers, minPlayers, questions, initialState, [], type);

		this.exemptionWasTaken = false;
		this.numMoneyTokens = players.length;
	}

	takeExemption() {
		this.exemptionWasTaken = true;
	}

	takeMoney() {
		if (this.numMoneyTokens > 0) {
			this.numMoneyTokens--;
		}
	}
}
