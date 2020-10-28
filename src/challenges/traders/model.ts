import Challenge from '../../models/challenge.model';

const type = 'traders';

export default class TradersChallenge extends Challenge {
	constructor(players, title, description, questions) {
		super(players, title, description, 6, 6, questions, 'game', [], type);
	}
}
