import ChallengeController from '../../controllers/challenge.controller';
import RoomController from '../../controllers/room.controller';
import ChallengeData from '../../interfaces/challenge-data';
import SocketHandler from '../../interfaces/socket-handler';
import WebSocketService from '../websocket.service';
import Challenge from '../../models/challenge.model';
import Player from '../../models/player.model';

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
				{ name: 'test1', numPlayers: Math.floor(players.length / 2) },
				{ name: 'test2', numPlayers: Math.ceil(players.length / 2) }
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

class SampleChallengeController extends ChallengeController {
	constructor(roomController: RoomController) {
		super(roomController);
	}
}

class SampleChallengeData extends ChallengeData {
	_type: string;

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
		return this._type;
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
	static getTestChallenge(room): SampleChallenge {
		return this.getTestChallengeData(room).model;
	}

	static getTestChallengeWithRoles(room): SampleChallenge {
		//TODO
		return this.getTestChallengeData(room).model;
	}

	static getTestChallengeData(room, withRoles = false): SampleChallengeData {
		const sampleChallengeData = new SampleChallengeData();
		sampleChallengeData.initModel(room.playersStillPlaying, 'en');

		if (withRoles) {
			sampleChallengeData.model.roles = [
				{ name: 'test1', numPlayers: Math.floor(room.playersStillPlaying.length / 2) },
				{ name: 'test2', numPlayers: Math.ceil(room.playersStillPlaying.length / 2) }
			];
		}

		return sampleChallengeData;
	}
}
