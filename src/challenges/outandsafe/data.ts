import ChallengeData, { ChallengeLanguageData, ChallengeLocalization } from '../../interfaces/challenge-data';
import OutAndSafeChallengeController from './controller';
import OutAndSafeChallenge from './model';
import OutAndSafeChallengeSocketHandler from './socket-handler';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';
import ChallengeController from '../../controllers/challenge.controller';
import Player from '../../models/player.model';

const challengeLanguageData = {
	en: {
		title: 'Out and Safe',
		description: '',
		questions: [
			{
				text: 'During the "Out and Safe" challenge, did the mole play an out card?',
				type: 'boolean',
				choices: [ 'Yes', 'No' ]
			}
		]
	} as ChallengeLanguageData
};

export default class OutAndSafeChallengeData extends ChallengeData {
	constructor() {
		super(new ChallengeLocalization(challengeLanguageData));
	}

	get type(): string {
		return 'outandsafe';
	}

	get maxPlayers(): number {
		return 10;
	}

	get minPlayers(): number {
		return 5;
	}

	setupSocketHandler(roomController: RoomController, webSocketService: WebSocketService, socket: any): SocketHandler {
		let outAndSafeChallengeController = this.getController(roomController) as OutAndSafeChallengeController;
		return new OutAndSafeChallengeSocketHandler(
			roomController,
			webSocketService,
			socket,
			outAndSafeChallengeController
		);
	}

	getController(roomController): ChallengeController {
		return new OutAndSafeChallengeController(roomController);
	}

	initModel(players: Player[], languageCode: string) {
		this.model = new OutAndSafeChallenge(
			players,
			this.getTitle(languageCode),
			this.getDescription(languageCode),
			this.getQuestions(languageCode)
		);
	}
}
