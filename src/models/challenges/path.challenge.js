import Challenge from './challenge.model';

import challengeData from './challenge.data'; // Lang?

const type = 'path';

export default class PathChallenge extends Challenge {
	constructor() {
		let { title, description, maxPlayers, minPlayers, questions, initialState } = challengeData[type];
		super(title, type, description, maxPlayers, minPlayers, questions, initialState);
	}
}
