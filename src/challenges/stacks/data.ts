import ChallengeData, { ChallengeLanguageData, ChallengeLocalization } from '../../interfaces/challenge-data';
import StacksChallengeController from './controller';
import StacksChallenge from './model';
import StacksChallengeSocketHandler from './socket-handler';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';
import ChallengeController from '../../controllers/challenge.controller';
import Player from '../../models/player.model';

const challengeLanguageData = {
	en: {
		title: 'Stacks',
		description: '',
		questions: [
			{
				text: "What was the amount of points on the mole's stack?",
				type: 'choices',
				choices: [ '-5', '-3', '-1', '1', '3', '5' ]
			}
		]
	} as ChallengeLanguageData
};

export default class StacksChallengeData extends ChallengeData {
	constructor() {
		super(new ChallengeLocalization(challengeLanguageData));
	}

	get type(): string {
		return 'stacks';
	}

	get maxPlayers(): number {
		return 6;
	}

	get minPlayers(): number {
		return 6;
	}

	setupSocketHandler(roomController: RoomController, webSocketService: WebSocketService, socket: any): SocketHandler {
		let stacksChallengeController = this.getController(roomController) as StacksChallengeController;
		return new StacksChallengeSocketHandler(roomController, webSocketService, socket, stacksChallengeController);
	}

	getController(roomController): ChallengeController {
		return new StacksChallengeController(roomController);
	}

	initModel(players: Player[], languageCode: string) {
		this.model = new StacksChallenge(
			players,
			this.getTitle(languageCode),
			this.getDescription(languageCode),
			this.getQuestions(languageCode)
		);
	}
}
