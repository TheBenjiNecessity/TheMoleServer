import challengeTypes from '../../challenges/challenge.data';
import Player from '../../models/player.model';
import ChallengeData from '../../interfaces/challenge-data';

export default class ChallengeService {
	constructor() {}

	static async getChallengeDataForType(type: string): Promise<ChallengeData> {
		let challengeData = await import(`../../challenges/${type}/data`);
		return challengeData.data;
	}

	static listChallengesForNumPlayers(numPlayers: number, challengeData: ChallengeData[]): ChallengeData[] {
		return challengeData.filter((cd) => cd.maxPlayers >= numPlayers && cd.minPlayers <= numPlayers);
	}

	static async listChallengeData(): Promise<ChallengeData[]> {
		return new Promise((resolve, reject) => {
			let promises = challengeTypes.map((type) => ChallengeService.getChallengeDataForType(type));
			Promise.all(promises).then((challenges) => resolve(challenges));
		});
	}
}
