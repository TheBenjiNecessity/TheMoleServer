export interface LanguageData {
	text: string;
}

export default abstract class Localization {
	constructor(private languageData: { [code: string]: LanguageData }) {}

	getText(language: string, type: string): any {
		return this.languageData[language][type];
	}
}
