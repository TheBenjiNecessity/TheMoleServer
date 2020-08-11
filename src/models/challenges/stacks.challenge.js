import Challenge from './challenge.model';

import challengeData from './challenge.data'; // Lang?

const type = 'stacks';

export default class StacksChallenge extends Challenge {
	constructor() {
		let { title, description, maxPlayers, minPlayers, questions, initialState } = challengeData.find(
			(c) => c.type === type
		);
		super(title, type, description, maxPlayers, minPlayers, questions, initialState);
	}
}
