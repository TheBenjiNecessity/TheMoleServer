export interface LanguageData {
    text: string;
}

export default abstract class Localization {
    constructor(private languageData: { [code: string]: LanguageData }) {}

    getText(language: string): string {
        return this.languageData[language].text;
    }
}