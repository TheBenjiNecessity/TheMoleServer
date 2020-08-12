import ArrayUtilsService from '../services/utils/array-utils.service';

export class Episode {
	constructor(numPlayers, challenges) {
		this.challenges = challenges;
		this.numPlayers = numPlayers;
	}

	getQuestions() {
		let questionsArray = this.challenges.map((c) => c.questions);
		return ArrayUtilsService.array2dTo1d(questionsArray);
	}
}
