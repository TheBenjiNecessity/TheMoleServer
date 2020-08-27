import PathChallenge from '../../models/challenges/path.challenge';
import PlatterChallenge from '../../models/challenges/platter.challenge';

export default class ChallengeService {
	constructor() {}

	static getChallengeForType(type, episode) {
		switch (type) {
			case 'path':
				return new PathChallenge(episode);
			case 'platter':
				return new PlatterChallenge(episode);
			default:
				return null;
		}
	}
}
