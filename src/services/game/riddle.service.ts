import Riddle from '../../models/riddle.model';
import riddleData from '../../data/riddle.data';

export default class RiddleService {
	constructor() {}

	static getRandomRiddle(lang: string, type: string = null): Riddle {
		return riddleData[lang].filter((r) => (type ? r.type === type : true));
	}
}
