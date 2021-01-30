import Challenge from '../challenge.model';
import RaisedHand from '../raisedHand.model';
import Role from '../role.model';

export default class SimplifiedChallenge {
	agreedPlayerNames: string[];
	raisedHands: RaisedHand[];
	votedPlayers: any;
	isChallengeRunning: boolean;
	timer: any;
	currentTime: number;
	roles: Role[];

	constructor(challenge: Challenge) {
		this.agreedPlayerNames = challenge.agreedPlayerNames;
		this.raisedHands = challenge.raisedHands;
		this.votedPlayers = challenge.votedPlayers;
		this.isChallengeRunning = challenge.isChallengeRunning;
		this.currentTime = challenge.currentTime;
		this.roles = challenge.roles;
	}
}
