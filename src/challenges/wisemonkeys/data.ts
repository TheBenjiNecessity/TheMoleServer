import ChallengeData, { ChallengeLanguageData, ChallengeLocalization } from '../../interfaces/challenge-data';
import WiseMonkeysChallengeController from './controller';
import WiseMonkeysChallenge from './model';
import WiseMonkeysChallengeSocketHandler from './socket-handler';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';
import ChallengeController from '../../controllers/challenge.controller';
import Player from '../../models/player.model';
import RiddleService, { IRiddleService } from '../../services/game/riddle.service';
import Riddle from '../../models/riddle.model';

const challengeLanguageData = {
	en: {
		title: 'Wise Monkeys',
		description: '',
		questions: [
			{
				text: 'In the "WiseMonkeys" challenge, what was the mole\'s role?',
				type: 'choice',
				choices: [ 'See no evil', 'Hear no evil', 'Speak no evil' ]
			}
		]
	} as ChallengeLanguageData
};

const MAX_NUM_RIDDLES = 3;

export default class WiseMonkeysChallengeData extends ChallengeData {
	constructor(private riddleService: IRiddleService = new RiddleService()) {
		super(new ChallengeLocalization(challengeLanguageData));
	}

	get type(): string {
		return 'wisemonkeys';
	}

	get maxPlayers(): number {
		return 6;
	}

	get minPlayers(): number {
		return 6;
	}

	setupSocketHandler(roomController: RoomController, webSocketService: WebSocketService, socket: any): SocketHandler {
		const challengeController = this.getController(roomController) as WiseMonkeysChallengeController;
		return new WiseMonkeysChallengeSocketHandler(roomController, webSocketService, socket, challengeController);
	}

	getController(roomController: RoomController): ChallengeController {
		return new WiseMonkeysChallengeController(roomController);
	}

	initModel(players: Player[], languageCode: string) {
		this.model = new WiseMonkeysChallenge(
			players,
			this.getTitle(languageCode),
			this.getDescription(languageCode),
			this.getQuestions(languageCode),
			this.riddleService.getRiddleList(languageCode, Riddle.RIDDLE_TYPE.WORD, MAX_NUM_RIDDLES)
		);
	}
}
