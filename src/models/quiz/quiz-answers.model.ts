import Answer from './quiz-answer.model';

/**
 * The answers to a quiz
 * @property {array<Answer>} answers the list of answers provided by a player
 * @property {int} time the time taken to complete the quiz
 * @property {int} objectsUsed the objects like exemptions or jokers used during the quiz
 */
export default class QuizAnswers {
	answers: Answer[];
	time: number;
	objectsUsed: any;

	constructor(answers = [], time = -1, objectsUsed = { exemption: 0, joker: 0, 'black-exemption': 0 }) {
		this.answers = answers;
		this.time = time;
		this.objectsUsed = objectsUsed;
	}

	get usedExemption() {
		return this.objectsUsed['exemption'] >= 1;
	}

	get usedBlackExemption() {
		return this.objectsUsed['black-exemption'] >= 1;
	}

	get numJokersUsed() {
		return this.objectsUsed['joker'];
	}

	getScore(moleQuizAnswers) {
		let score = 0;
		for (let i = 0; i < this.answers.length; i++) {
			let currentAnswer = this.answers[i];
			let moleAnswer = moleQuizAnswers[i];

			if (currentAnswer.isCorrect(moleAnswer)) {
				score++;
			}
		}
		return score;
	}
}
