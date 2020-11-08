import Question from './question.model';

export default class Answer {
	constructor(public question: Question, public answerIndex: number) {}

	isCorrect(moleAnswer: Answer): boolean {
		return this.question.text === moleAnswer.question.text && this.answerIndex === moleAnswer.answerIndex;
	}
}
