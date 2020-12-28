import ChallengeController from '../../controllers/challenge.controller';
import RoomController from '../../controllers/room.controller';
import ChallengeData, { ChallengeLanguageData, ChallengeLocalization } from '../../interfaces/challenge-data';
import SocketHandler from '../../interfaces/socket-handler';
import WebSocketService from '../websocket.service';
import Challenge from '../../models/challenge.model';
import Player from '../../models/player.model';
import Role from '../../models/role.model';

class SampleChallenge extends Challenge {
	constructor(players: Player[]) {
		super(players, 'Test title', 'Test description', [], Challenge.CHALLENGE_STATES.IN_GAME);
	}
}

class SampleRoleChallenge extends Challenge {
	constructor(players: Player[]) {
		super(players, 'Test', '', [], Challenge.CHALLENGE_STATES.ROLE_SELECTION);
	}

	getRoles(numPlayers: number): Role[] {
		return [
			{ name: 'test1', numPlayers: Math.floor(numPlayers / 2) },
			{ name: 'test2', numPlayers: Math.ceil(numPlayers / 2) }
		];
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

	stateDidChange(roomcode: string, previousState: string, newState: string) {}

	getCurrentChallenge(roomcode: string): Challenge {
		throw new Error('Method not implemented.');
	}
}

const challengeLanguageData = {
	title: 'Test',
	description: '',
	questions: [
		{
			text: 'Test?',
			type: 'choices',
			choices: [ 'Yes', 'No' ]
		}
	]
} as ChallengeLanguageData;

class SampleChallengeData extends ChallengeData {
	_type: string;

	constructor(private withRoles = false) {
		super(new ChallengeLocalization({ en: challengeLanguageData }));
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

	initModel(players, languageCode: string) {
		this.model = this.withRoles ? new SampleRoleChallenge(players) : new SampleChallenge(players);
	}
}

export default class ChallengeSampleService {
	static getTestChallenge(players: Player[], withRoles = false): SampleChallenge {
		return this.getTestChallengeDatum(players, 'type', withRoles).model;
	}

	static getTestChallengeDatum(players: Player[], type: string = 'type', withRoles = false): SampleChallengeData {
		const sampleChallengeData = new SampleChallengeData(withRoles);
		sampleChallengeData.initModel(players, 'en');
		sampleChallengeData._type = type;
		return sampleChallengeData;
	}

	static getTestChallengeData(players: Player[], withRoles: boolean[] = []): SampleChallengeData[] {
		return withRoles.map((r, i) => ChallengeSampleService.getTestChallengeDatum(players, 'test ' + i, r));
	}
}
