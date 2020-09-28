import challengeTypes from '../../challenges/challenge.data';
import Player from '../../models/player.model';

export default class ChallengeService {
	constructor() {}

	static async getChallengeDataForType(type: string): Promise<any> {
		return await import(`../../challenges/${type}/data`);
	}

	static async getChallengeControllerForType(type: string): Promise<any> {
		let challengeData = await ChallengeService.getChallengeDataForType(type);
		return challengeData.getController();
	}

	static async getChallengeForType(type: string, players: Player[]): Promise<any> {
		let challengeData = await ChallengeService.getChallengeDataForType(type);
		return challengeData.getModel(players, 'en');
	}

	static async listChallengesForNumPlayers(numPlayers: number): Promise<any[]> {
		let numPlayersRestrictedChallenges = [];
		for (let type of challengeTypes) {
			let challengeData = await ChallengeService.getChallengeDataForType(type);
			if (challengeData.maxPlayers >= numPlayers && challengeData.minPlayers >= numPlayers) {
				numPlayersRestrictedChallenges.push(challengeData);
			}
		}
		return numPlayersRestrictedChallenges;
	}

	static async listChallengeData(): Promise<any[]> {
		return new Promise((resolve, reject) => {
			let promises = challengeTypes.map((type) => ChallengeService.getChallengeDataForType(type));
			Promise.all(promises).then((challenges) => resolve(challenges.map((c) => c.default)));
		});
	}
}
