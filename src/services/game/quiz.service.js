import { Challenge } from '../../models/challenge.model';

const questions = [ new Challenge('Odd Man Out', 'P'), new Challenge('Odd Man Out', '') ];

export class QuizService {
	static questions = questions;
	availableQuestions = [];

	constructor() {
		this.availableQuestions = QuizService.questions;
	}

	getQuiz(numPlayers) {
		if (numRestrictedChallenges.length > 0) {
			numRestrictedChallenges = ArrayUtilsService.shuffleArray(numRestrictedChallenges);

			let elementToRemove = numRestrictedChallenges[0];
			this.availableChallenges = ArrayUtilsService.removeElementByValue(
				this.availableChallenges,
				elementToRemove
			);

			return elementToRemove;
		}

		return null;
	}

	getQuestion(challenge) {}
}
