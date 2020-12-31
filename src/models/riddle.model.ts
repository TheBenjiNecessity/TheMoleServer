export default class Riddle {
	static RIDDLE_TYPE = {
		WORD: 'word',
		WORD_LIST: 'word-list'
	};

	constructor(public text: string, public answer: string, public type: string) {}

	isInputCorrect(inputText: string): boolean {
		return this.answer === inputText;
	}
}
