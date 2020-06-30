import Challenge from './challenge.model';

import challengeData from './challenge.data'; // Lang?

const type = 'out-and-safe';

export default class OutAndSafeChallenge extends Challenge {
	constructor() {
		let { title, description, maxPlayers, minPlayers, questions, initialState } = challengeData[type];
		super(title, type, description, maxPlayers, minPlayers, questions, initialState);
	}
}
