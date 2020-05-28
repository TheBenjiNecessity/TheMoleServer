import { Challenge } from './challenge.model';

export class Episode {
	constructor(numPlayers, challenges) {
		this.challenges = challenges;
		this.numPlayers = numPlayers;
	}
}
