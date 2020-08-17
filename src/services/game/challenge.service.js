import ArrayUtilsService from '../utils/array-utils.service';
import challengeData from '../../models/challenges/challenge.data';
import PathChallenge from '../../models/challenges/path.challenge';
import PlatterChallenge from '../../models/challenges/platter.challenge';

export default class ChallengeService {
	constructor() {}

	static getChallengeForType(type, room) {
		switch (type) {
			case 'path':
				return new PathChallenge(room);
			case 'platter':
				return new PlatterChallenge(room);
			default:
				return null;
		}
	}
}
