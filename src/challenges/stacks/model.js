import Challenge from '../challenge.model';

const type = 'stacks';

export default class StacksChallenge extends Challenge {
	constructor(players, title, description, maxPlayers, minPlayers, questions, initialState) {
		super(players, title, description, maxPlayers, minPlayers, questions, initialState, [], type);
	}
}
