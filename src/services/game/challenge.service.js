import ArrayUtilsService from '../utils/array-utils.service';
import challengeData from '../../models/challenges/challenge.data';

export default class ChallengeService {
	constructor() {}

	/**
	 * Lists all of the challenges that can support the number of players given
	 * @param {int} numPlayers the desired number of players to play the challenge
	 * @returns {[object]} the list of challenges
	 */
	static getNumPlayersRestrictedChallenges(numPlayers) {
		let numRestrictedChallenges = [];
		for (let challengeKey of Object.keys(challengeData)) {
			let challenge = challengeData[challengeKey];
			if (canSupportNumPlayers(challenge, numPlayers)) {
				numRestrictedChallenges.push(challenge);
			}
		}
		return numRestrictedChallenges;
	}

	/**
	 * Gets a challenge from the challenge data that isn't already in use
	 * @param {int} numPlayers the number of players playing in that challenge
	 * @param {[object]} challengesToExclude the challenges already loaded into the game
	 */
	static getRandomChallengeForPlayers(numPlayers, challengesToExclude) {
		let numRestrictedChallenges = getNumPlayersRestrictedChallenges(numPlayers);

		if (numRestrictedChallenges.length > 0) {
			return ArrayUtilsService.getRandomElementNotInOtherArray(numRestrictedChallenges, challengesToExclude);
		}

		return null;
	}

	/**
	 * Checks to see if the challenge given can support the number of players given
	 * @param {object} challenge the challenge data containing min/max players
	 * @param {int} numPlayers the number of players playing
	 * @returns {boolean} whether or not the challenge given supports the number of players
	 */
	static canSupportNumPlayers(challenge, numPlayers) {
		return challenge.maxPlayers >= numPlayers && challenge.minPlayers <= numPlayers;
	}
}
