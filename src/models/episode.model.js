import ArrayUtilsService from '../services/utils/array-utils.service';

export class Episode {
	get currentChallenge() {
		if (this.episodeIsOver) {
			return null;
		}

		return this.challenges[this.currentChallengeIndex];
	}

	get episodeIsOver() {
		return this.currentChallengeIndex >= this.challenges.length;
	}

	constructor(numPlayers, challenges) {
		this.currentChallengeIndex = 0;
		this.challenges = challenges;
		this.numPlayers = numPlayers;
	}

	getQuestions() {
		let questionsArray = this.challenges.map((c) => c.questions);
		return ArrayUtilsService.array2dTo1d(questionsArray);
	}

	increaseChallengeIndex() {
		this.currentChallengeIndex++;
	}
}
