import Localization, { LanguageData } from './l10n.model';

interface RiddleLanguageData extends LanguageData {
	answer: string;
	type: string;
}

export default class Riddle extends Localization {
	static RIDDLE_TYPE = {
		WORD: 'word',
		WORD_LIST: 'word-list'
	};

	constructor(private riddleLanguageData: { [code: string]: RiddleLanguageData }) {
		super(riddleLanguageData);
	}

	getAnswer(language: string): string {
		return this.riddleLanguageData[language].answer;
	}

	getType(language: string): string {
		return this.riddleLanguageData[language].answer;
	}

	isInputCorrent(inputText: string, language: string): boolean {
		return this.getAnswer(language) === inputText;
	}
}
