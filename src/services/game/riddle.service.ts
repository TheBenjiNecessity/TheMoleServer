import Riddle from '../../models/riddle.model';
import riddleData from '../../data/riddle.data';
import * as _ from 'lodash';

export interface IRiddleService {
	getRandomRiddle(lang: string, type: string): Riddle;
	getRiddleList(lang: string, type: string, count: number): Riddle[];
}

export default class RiddleService implements IRiddleService {
	constructor() {}

	getRandomRiddle(lang: string, type: string): Riddle {
		return this.getRiddleList(lang, type, 1)[0];
	}

	getRiddleList(lang: string, type: string, count: number): Riddle[] {
		let riddlesForType = riddleData[lang].filter((r) => (type ? r.type === type : true));
		let shuffledRiddlesForType = _.shuffle(riddlesForType);
		return shuffledRiddlesForType.slice(0, count).map((s) => new Riddle(s.type, s.answer, s.type));
	}
}
