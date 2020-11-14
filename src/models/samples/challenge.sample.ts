import ChallengeController from '../../controllers/challenge.controller';
import RoomController from '../../controllers/room.controller';
import Challenge from '../challenge.model';
import Player from '../player.model';

class SampleChallenge extends Challenge {
	constructor(players: Player[]) {
		super(players, 'Test title', 'Test description', [], Challenge.CHALLENGE_STATES.IN_GAME, [], 'Test type');
	}
}

class SampleRoleChallenge extends Challenge {
	constructor(players: Player[]) {
		super(
			players,
			'Test title',
			'Test description',
			[],
			Challenge.CHALLENGE_STATES.ROLE_SELECTION,
			[],
			'Test type'
		);
	}
}

export default class ChallengeSampleService {
	static getTestChallenge(room) {
		return new SampleChallenge(room.playersStillPlaying);
	}

	static getTestChallengeWithRoles(room) {
		return new SampleRoleChallenge(room.playersStillPlaying);
	}
}
