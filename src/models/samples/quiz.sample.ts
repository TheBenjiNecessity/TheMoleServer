import Question from '../quiz/question.model';
import Quiz from '../quiz/quiz.model';
import QuizAnswers from '../quiz/quiz-answers.model';
import Answer from '../quiz/quiz-answer.model';

export default class QuizSampleService {
	static getTestQuiz(): Quiz {
		let question = {
			text: 'Question text?',
			type: 'choices',
			choices: [ 'Choice 1', 'Choice 2', 'Choice 3', 'Choice 4', 'Choice 5' ]
		};
		let questions: Question[] = [];

		for (let i = 0; i < 20; i++) {
			questions.push(question);
		}

		return { questions };
	}

	static getQuizAnswers(quiz: Quiz, indices: number[]): QuizAnswers {
		let answers: Answer[] = quiz.questions.map((q, i) => new Answer(q, indices[i]));
		return new QuizAnswers(answers, 1);
	}

	static getMoleQuizAnswers(quiz: Quiz): QuizAnswers {
		return QuizSampleService.getQuizAnswers(quiz, quiz.questions.map((q) => 0));
	}

	static getPerfectQuizAnswers(moleQuizAnswers: QuizAnswers, time: number): QuizAnswers {
		let indices: number[] = [];

		for (let i = 0; i < moleQuizAnswers.answers.length; i++) {
			let answer = moleQuizAnswers.answers[i];
			indices.push(answer.answerIndex);
		}

		return new QuizAnswers(indices.map((i, index) => new Answer(moleQuizAnswers.answers[index].question, i)), time);
	}

	// Three quarter answers are correct
	static getGreatQuizAnswers(moleQuizAnswers: QuizAnswers, time: number): QuizAnswers {
		let indices: number[] = [];

		for (let i = 0; i < moleQuizAnswers.answers.length; i++) {
			let answer = moleQuizAnswers.answers[i];
			if (i >= 0 && i <= 4) {
				indices.push((answer.answerIndex + 1) % answer.question.choices.length);
			} else {
				indices.push(answer.answerIndex);
			}
		}

		return new QuizAnswers(indices.map((i, index) => new Answer(moleQuizAnswers.answers[index].question, i)), time);
	}

	// Half of all answers are correct
	static getGoodQuizAnswers(moleQuizAnswers: QuizAnswers, time: number) {
		let indices: number[] = [];
		for (let i = 0; i < moleQuizAnswers.answers.length; i++) {
			let answer = moleQuizAnswers.answers[i];
			if (i < 10) {
				indices.push((answer.answerIndex + 1) % answer.question.choices.length);
			} else {
				indices.push(answer.answerIndex);
			}
		}
		return new QuizAnswers(indices.map((i, index) => new Answer(moleQuizAnswers.answers[index].question, i)), time);
	}

	// Three quarter answers are wrong
	static getBadQuizAnswers(moleQuizAnswers: QuizAnswers, time: number) {
		let indices: number[] = [];
		for (let i = 0; i < moleQuizAnswers.answers.length; i++) {
			let answer = moleQuizAnswers.answers[i];
			if (i >= 5) {
				indices.push((answer.answerIndex + 1) % answer.question.choices.length);
			} else {
				indices.push(answer.answerIndex);
			}
		}
		return new QuizAnswers(indices.map((i, index) => new Answer(moleQuizAnswers.answers[index].question, i)), time);
	}

	// All answers are wrong
	static getLoserQuizAnswers(moleQuizAnswers: QuizAnswers, time: number) {
		let indices: number[] = [];
		for (let i = 0; i < moleQuizAnswers.answers.length; i++) {
			let answer = moleQuizAnswers.answers[i];
			indices.push((answer.answerIndex + 1) % answer.question.choices.length);
		}
		return new QuizAnswers(indices.map((i, index) => new Answer(moleQuizAnswers.answers[index].question, i)), time);
	}
}
