import { Challenge } from '../../models/challenge.model';

export class QuizService {
	constructor() {
		this.availableQuestions = QuizService.questions;
	}

	getQuiz(numPlayers) {
		if (numRestrictedChallenges.length > 0) {
			numRestrictedChallenges = ArrayUtilsService.shuffleArray(numRestrictedChallenges);

			let elementToRemove = numRestrictedChallenges[0];
			this.availableQuestions = ArrayUtilsService.removeElementByValue(this.availableQuestions, elementToRemove);

			return elementToRemove;
		}

		return null;
	}

	getQuestion(challenge) {}
}
