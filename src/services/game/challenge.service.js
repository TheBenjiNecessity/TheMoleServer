import PathChallenge from '../../models/challenges/path.challenge';
import PlatterChallenge from '../../models/challenges/platter.challenge';

export default class ChallengeService {
	constructor() {}

	static getChallengeForType(type, players) {
		switch (type) {
			case 'path':
				return new PathChallenge(players);
			case 'platter':
				return new PlatterChallenge(players);
			default:
				return null;
		}
	}
}
