import ChallengeController from '../../controllers/challenge.controller';
import RoomController from '../../controllers/room.controller';
import ChallengeData from '../../interfaces/challenge-data';
import SocketHandler from '../../interfaces/socket-handler';
import WebSocketService from '../../services/websocket.service';
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
			[
				{ name: 'test 1', numPlayers: Math.floor(players.length / 2) },
				{ name: 'test 2', numPlayers: Math.ceil(players.length / 2) }
			],
			'Test type'
		);
	}
}

class SampleSocketHandler extends SocketHandler {
	constructor(roomController: RoomController, webSocketService: WebSocketService, socket: any) {
		super(roomController, webSocketService, socket);
	}
}

class SampleChallengeData extends ChallengeData {
	constructor() {
		super({
			en: {
				title: 'Test',
				description: '',
				questions: [
					{
						text: 'Test?',
						type: 'choices',
						choices: [ 'Yes', 'No' ]
					}
				]
			}
		});
	}

	get type(): string {
		return 'test';
	}

	get maxPlayers(): number {
		return 10;
	}

	get minPlayers(): number {
		return 3;
	}

	setupSocketHandler(roomController: RoomController, webSocketService: WebSocketService, socket: any): SocketHandler {
		return new SampleSocketHandler(roomController, webSocketService, socket);
	}

	getController(roomController: RoomController) {
		return new SampleChallengeController(roomController);
	}

	initModel(players, lang) {
		this.model = new SampleRoleChallenge(players);
	}
}

export default class ChallengeSampleService {
	static getTestChallenge(room) {
		return this.getTestChallengeData(room).model;
	}

	static getTestChallengeWithRoles(room) {
		//TODO
		return this.getTestChallengeData(room).model;
	}

	static getTestChallengeData(room) {
		const sampleChallengeData = new SampleChallengeData();
		sampleChallengeData.initModel(room.playersStillPlaying, 'en');
		return sampleChallengeData;
	}
}
