import Challenge from '../../models/challenge.model';

const type = 'stacks';

export default class StacksChallenge extends Challenge {
	constructor(players, title, description, questions) {
		super(players, title, description, 6, 6, questions, 'game', [], type);
	}
}
