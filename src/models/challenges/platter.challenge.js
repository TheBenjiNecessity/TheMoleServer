import Challenge from './challenge.model';

import challengeData from './challenge.data'; // Lang?

const type = 'platter';

export default class PlatterChallenge extends Challenge {
	constructor(players) {
		let { title, description, maxPlayers, minPlayers, questions, initialState } = challengeData[type];
		super(title, type, description, maxPlayers, minPlayers, questions, initialState);

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

	performEvent(event, obj) {
		switch (event) {
			case 'platter-take-exemption':
				takeExemption();
				break;
			case 'platter-take-money':
				takeMoney();
				break;
			default:
				super.performEvent(event, obj);
				break;
		}
	}
}
