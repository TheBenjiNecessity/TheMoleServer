import ArrayUtilsService from '../utils/array-utils.service';

import OutAndSafeChallenge from '../../models/challenges/out-and-safe.challenge';
import PlatterChallenge from '../../models/challenges/platter.challenge';
import MoleTalkChallenge from '../../models/challenges/moletalk.challenge';
import PushYourLuckChallenge from '../../models/challenges/push-your-luck.challenge';
import StacksChallenge from '../../models/challenges/stacks.challenge';
import TradersChallenge from '../../models/challenges/traders.challenge';
import ButtonChallenge from '../../models/challenges/button.challenge';

const challenges = [
	new OutAndSafeChallenge(),
	new PlatterChallenge(),
	new MoleTalkChallenge(),
	new PushYourLuckChallenge(),
	new StacksChallenge(),
	new TradersChallenge(),
	new ButtonChallenge()
];

export default class ChallengeService {
	constructor() {}

	static getRandomChallengeForPlayers(numPlayers, currentChallenges) {
		let numRestrictedChallenges = challenges.filter((c) => c.canSupportNumPlayers(numPlayers));

		if (numRestrictedChallenges.length > 0) {
			return ArrayUtilsService.getRandomElementNotInOtherArray(numRestrictedChallenges, currentChallenges);
		}

		return null;
	}
}
