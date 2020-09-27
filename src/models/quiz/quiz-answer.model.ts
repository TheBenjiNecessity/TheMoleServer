import Question from './question.model';

export default class Answer {
	question: Question;
	answer: number;

	constructor(question, answerIndex) {
		this.question = question;
		this.answer = answerIndex;
	}

	isCorrect(moleAnswer) {
		return this.question.text === moleAnswer.question.text && this.answer === moleAnswer.answer;
	}
}
