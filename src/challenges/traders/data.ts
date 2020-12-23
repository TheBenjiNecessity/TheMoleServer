import ChallengeData, { ChallengeLanguageData, ChallengeLocalization } from '../../interfaces/challenge-data';
import TradersChallengeController from './controller';
import TradersChallenge from './model';
import TradersChallengeSocketHandler from './socket-handler';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';
import ChallengeController from '../../controllers/challenge.controller';
import Player from '../../models/player.model';

const challengeLanguageData = {
	en: {
		title: 'Traders',
		description: '',
		questions: [
			{
				text: 'What reward did the mole end up with?',
				type: 'choices',
				choices: [ 'An exemption', 'A joker', 'Two jokers', 'Three jokers', 'Money', 'Nothing' ]
			},
			{
				text: 'What reward did the mole start with?',
				type: 'choices',
				choices: [ 'An exemption', 'A joker', 'Two jokers', 'Three jokers', 'Money', 'Nothing' ]
			}
		]
	} as ChallengeLanguageData
};

export default class TradersChallengeData extends ChallengeData {
	constructor() {
		super(new ChallengeLocalization(challengeLanguageData));
	}

	get type(): string {
		return 'traders';
	}

	get maxPlayers(): number {
		return 6;
	}

	get minPlayers(): number {
		return 6;
	}

	setupSocketHandler(roomController: RoomController, webSocketService: WebSocketService, socket: any): SocketHandler {
		let stacksChallengeController = this.getController(roomController) as TradersChallengeController;
		return new TradersChallengeSocketHandler(roomController, webSocketService, socket, stacksChallengeController);
	}

	getController(roomController): ChallengeController {
		return new TradersChallengeController(roomController);
	}

	initModel(players: Player[], languageCode: string) {
		this.model = new TradersChallenge(
			players,
			this.getTitle(languageCode),
			this.getDescription(languageCode),
			this.getQuestions(languageCode)
		);
	}
}
