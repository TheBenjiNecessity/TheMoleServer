import { Challenge } from './challenge.model';

export class Episode {
	challenges = [];
	numPlayers = -1;

	constructor(numPlayers, challenges) {
		this.challenges = challenges;
		this.numPlayers = numPlayers;
	}
}
