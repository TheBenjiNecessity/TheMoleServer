import { PlatterChallenge } from './platter.challenge';
import { OutAndSafeChallenge } from './out-and-safe.challenge';

export default class ChallengeFactory {
	constructor(type) {
		switch (type) {
			case 'platter':
				return new PlatterChallenge();
			case 'out-and-safe':
				return new OutAndSafeChallenge();
			default:
				return null;
		}
	}

	canSupportNumPlayers(numPlayers) {
		return numPlayers >= this.minPlayers && numPlayers <= this.maxPlayers;
	}
}
