import challengeTypes from '../../challenges/challenge.data';
import ChallengeData from '../../interfaces/challenge-data';

export default class ChallengeService {
	constructor() {}

	static async getChallengeDataForType(type: string): Promise<ChallengeData> {
		let challengeData = await import(`../../challenges/${type}/data`);
		return new challengeData.default();
	}

	static async listChallengeData(): Promise<ChallengeData[]> {
		return new Promise((resolve, reject) => {
			let promises = challengeTypes.map((type) => ChallengeService.getChallengeDataForType(type));
			Promise.all(promises).then((challenges) => resolve(challenges));
		});
	}

	static listChallengesForNumPlayers(
		numPlayers: number,
		challengeData: ChallengeData[],
		usedChallenges: ChallengeData[]
	): ChallengeData[] {
		let numPlayerRestrictedChallenges = challengeData.filter(
			(cd) => cd.maxPlayers >= numPlayers && cd.minPlayers <= numPlayers
		);

		return numPlayerRestrictedChallenges.filter((nc) => usedChallenges.map((uc) => uc.type).indexOf(nc.type) < 0);
	}
}
