import ArrayUtilsService from '../utils/array-utils.service';
import challengeData from '../../models/challenges/challenge.data';

export default class ChallengeService {
	constructor() {}

	static getRandomChallengeForPlayers(numPlayers, currentChallenges) {
		let numRestrictedChallenges = [];
		for (let challenge of challengeData) {
			if (challenge.maxPlayers >= numPlayers && challenge.minPlayers <= numPlayers) {
				numRestrictedChallenges.push(challenge);
			}
		}

		if (numRestrictedChallenges.length > 0) {
			return ArrayUtilsService.getRandomElementNotInOtherArray(numRestrictedChallenges, currentChallenges);
		}

		return null;
	}
}
