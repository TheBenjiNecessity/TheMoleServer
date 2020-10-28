import ChallengeData from '../../interfaces/challenge-data';
import { readdirSync } from 'fs';

export default class ChallengeService {
	constructor() {}

	static listChallengeTypes(): string[] {
		const getDirectories = (source) =>
			readdirSync(source, { withFileTypes: true })
				.filter((dirent) => dirent.isDirectory())
				.map((dirent) => dirent.name);
		return getDirectories('dist/challenges');
	}

	static async getChallengeDataForType(type: string): Promise<ChallengeData> {
		let challengeData = await import(`../../challenges/${type}/data`);
		return new challengeData.default();
	}

	static async listChallengeData(): Promise<ChallengeData[]> {
		return new Promise((resolve, reject) => {
			let types = ChallengeService.listChallengeTypes();
			let promises = types.map((type) => ChallengeService.getChallengeDataForType(type));
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
