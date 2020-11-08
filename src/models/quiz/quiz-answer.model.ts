import Question from './question.model';

export default class Answer {
	constructor(public question: Question, public answerIndex: number) { }

	isCorrect(moleAnswer) {
		return this.question.text === moleAnswer.question.text && this.answerIndex === moleAnswer.answer;
	}
}
