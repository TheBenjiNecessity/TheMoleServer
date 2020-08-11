import ArrayUtilsService from '../utils/array-utils.service';
import challengeData from '../../models/challenges/challenge.data';
import PathChallenge from '../../models/challenges/path.challenge';
import PlatterChallenge from '../../models/challenges/platter.challenge';

export default class ChallengeService {
	constructor() {}

	/**
	 * Lists all of the challenges that can support the number of players given
	 * @param {int} numPlayers the desired number of players to play the challenge
	 * @returns {[object]} the list of challenges
	 */
	static getNumPlayersRestrictedChallengeData(numPlayers) {
		return challengeData.filter((c) => ChallengeService.canSupportNumPlayers(c, numPlayers));
	}

	/**
	 * Gets a challenge from the challenge data that isn't already in use
	 * @param {int} numPlayers the number of players playing in that challenge
	 * @param {[object]} challengesToExclude the challenges already loaded into the game
	 */
	static getRandomChallengeForPlayers(room, numPlayers, challengesToExclude) {
		let numRestrictedChallengeData = ChallengeService.getNumPlayersRestrictedChallengeData(numPlayers);
		if (numRestrictedChallengeData.length > 0) {
			let numRestrictedChallengeTypes = numRestrictedChallengeData.map((c) => c.type);

			let challengeTypesNotUsed = numRestrictedChallengeTypes.filter(
				(type) => !challengesToExclude.map((e) => e.type).includes(type)
			);
			let randomTypeNotUsed = ArrayUtilsService.getRandomElement(challengeTypesNotUsed);
			return ChallengeService.getChallengeForType(room, randomTypeNotUsed);
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

	static getChallengeForType(type, room) {
		switch (type) {
			case 'path':
				return new PathChallenge(room);
			case 'platter':
				return new PlatterChallenge(room);
		}
	}
}
