import Challenge from '../../models/challenge.model';

const type = 'traders';

export default class TradersChallenge extends Challenge {
	constructor(players, questions) {
		super(players, questions, 'game');
	}
}
