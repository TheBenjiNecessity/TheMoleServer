export default class Answer {
	constructor(question, answerIndex) {
		this.question = question;
		this.answer = answerIndex;
	}

	isCorrect(moleAnswer) {
		return this.question.text === moleAnswer.question.text && this.answer === moleAnswer.answer;
	}
}
