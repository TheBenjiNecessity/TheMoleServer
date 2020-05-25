import { Challenge } from '../../models/challenge.model';
import { ArrayUtilsService } from '../utils/array-utils.service';

const challenges = [ new Challenge('Odd Man Out', 'P'), new Challenge('Odd Man Out', '') ];

export class ChallengeService {
	static challenges = challenges;
	availableChallenges = [];

	constructor() {
		this.availableChallenges = ChallengeService.challenges;
	}

	getChallenge(numPlayers) {
		let numRestrictedChallenges = this.availableChallenges.filter((c) => c.canSupportNumPlayers(numPlayers));

		if (numRestrictedChallenges.length > 0) {
			numRestrictedChallenges = ArrayUtilsService.shuffleArray(numRestrictedChallenges);

			let elementToRemove = numRestrictedChallenges[0];
			this.availableChallenges = ArrayUtilsService.removeElementByValue(
				this.availableChallenges,
				elementToRemove
			);

			return elementToRemove;
		}

		return null;
	}
}
