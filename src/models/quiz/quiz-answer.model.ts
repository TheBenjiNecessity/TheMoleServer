import Question from './question.model';

export default class Answer {
	constructor(private question: Question, private answerIndex: number) { }

	isCorrect(moleAnswer) {
		return this.question.text === moleAnswer.question.text && this.answerIndex === moleAnswer.answer;
	}
}
