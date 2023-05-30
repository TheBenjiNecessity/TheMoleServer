import Player from '../player.model';

export interface IMoleChooser {
	getMoleIndex(players: Player[]);
}

export class MoleChooser implements IMoleChooser {
	constructor() {}

	getMoleIndex(players: Player[]) {
		return players.randomIndex();
	}
}
