import ChallengeData, { ChallengeLanguageData, ChallengeLocalization } from '../../interfaces/challenge-data';
import PlatterChallengeController from './controller';
import PlatterChallenge from './model';
import PlatterChallengeSocketHandler from './socket-handler';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';
import ChallengeController from '../../controllers/challenge.controller';
import Player from '../../models/player.model';

const challengeLanguageData = {
	en: {
		title: 'The Platter',
		description: '',
		questions: [
			{
				text: 'In the "Platter" challenge, did the mole take the exemption?',
				type: 'boolean',
				choices: [ 'Yes', 'No' ]
			},
			{
				text: 'In the "Platter" challenge, in what position did the mole take points?',
				type: 'rank',
				choices: [ 'The mole did not take points' ]
			}
		]
	} as ChallengeLanguageData
};

export default class PlatterChallengeData extends ChallengeData {
	constructor() {
		super(new ChallengeLocalization(challengeLanguageData));
	}

	get type(): string {
		return 'platter';
	}

	get maxPlayers(): number {
		return 6;
	}

	get minPlayers(): number {
		return 4;
	}

	setupSocketHandler(roomController: RoomController, webSocketService: WebSocketService, socket: any): SocketHandler {
		let platterChallengeController = this.getController(roomController) as PlatterChallengeController;
		return new PlatterChallengeSocketHandler(roomController, webSocketService, socket, platterChallengeController);
	}

	getController(roomController): ChallengeController {
		return new PlatterChallengeController(roomController);
	}

	initModel(players: Player[], languageCode: string) {
		this.model = new PlatterChallenge(
			players,
			this.getTitle(languageCode),
			this.getDescription(languageCode),
			this.getQuestions(languageCode)
		);
	}
}
