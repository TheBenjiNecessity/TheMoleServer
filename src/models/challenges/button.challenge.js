import Challenge from './challenge.model';

import challengeData from './challenge.data'; // Lang?

const type = 'button';

export default class ButtonChallenge extends Challenge {
	constructor() {
		let { title, description, maxPlayers, minPlayers, questions, initialState } = challengeData.find(
			(c) => c.type === type
		);
		super(title, type, description, maxPlayers, minPlayers, questions, initialState);
	}
}

/**
 * At least one player must keep their finger pressed on the screen at all times or else a bomb goes off.
 * But, if they take their finger off the button, then they will see a puzzle where if they are able to solve
 * it then they could win an exemption.
 */
