import Challenge from './challenge.model';

import challengeData from './challenge.data'; // Lang?

const type = 'traders';

export default class TradersChallenge extends Challenge {
	constructor() {
		let { title, description, maxPlayers, minPlayers, questions, initialState } = challengeData.find(
			(c) => c.type === type
		);
		super(title, type, description, maxPlayers, minPlayers, questions, initialState);
	}
}
