import challengeTypes from '../../challenges/challenge.data';

export default class ChallengeService {
	constructor() {}

	static async getChallengeDataForType(type) {
		return await import(`../../challenges/${type}-challenge/data`);
	}

	static async getChallengeControllerForType(type) {
		let challengeData = await ChallengeService.getChallengeDataForType(type);
		return challengeData.getController();
	}

	static async getChallengeForType(type, players) {
		let challengeData = await ChallengeService.getChallengeDataForType(type);
		return challengeData.getModel(players, 'en');
	}

	static async listChallengesForNumPlayers(numPlayers) {
		let numPlayersRestrictedChallenges = [];
		for (let type of challengeTypes) {
			let challengeData = await ChallengeService.getChallengeDataForType(type);
			if (challengeData.maxPlayers >= numPlayers && challengeData.minPlayers >= numPlayers) {
				numPlayersRestrictedChallenges.push(challengeData);
			}
		}
		return numPlayersRestrictedChallenges;
	}

	static async listChallengeData() {
		return new Promise((resolve, reject) => {
			let promises = challengeTypes.map((type) => ChallengeService.getChallengeDataForType(type));
			Promise.all(promises).then((challenges) => resolve(challenges));
		});
	}
}
