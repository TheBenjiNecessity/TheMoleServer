import Challenge from '../challenge.model';
import Player from '../player.model';

class SampleChallenge extends Challenge {
	constructor(players: Player[]) {
		super(players, 'Test title', 'Test description', 10, 3, [], 'game', [], 'Test type');
	}
}

export default class ChallengeSampleService {
	static getTestChallenge(room) {
		return new SampleChallenge(room.playersStillPlaying);
	}
}
