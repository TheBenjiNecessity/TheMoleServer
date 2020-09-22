import Challenge from '../challenge.model';

const type = 'outandsafe';

export default class OutAndSafeChallenge extends Challenge {
	constructor(players, title, description, maxPlayers, minPlayers, questions, initialState) {
		super(players, title, description, maxPlayers, minPlayers, questions, initialState, [], type);
	}
}
