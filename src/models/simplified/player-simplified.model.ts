import Player from '../player.model';

export default class SimplifiedPlayer {
	numExemptions: number;
	numBlackExemptions: number;
	numJoker: number;
	eliminated: boolean;
	isMole: boolean;
	currentRoleName: string;

	constructor(player: Player) {
		this.numBlackExemptions = player.numBlackExemptions;
		this.numJoker = player.numJoker;
		this.numExemptions = player.numExemptions;
		this.eliminated = player.eliminated;
		this.isMole = player.isMole;
		this.currentRoleName = player.currentRoleName;
	}
}
