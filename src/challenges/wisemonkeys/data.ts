import ChallengeData from '../../interfaces/challenge-data';
import WiseMonkeysChallengeController from './controller';
import WiseMonkeysChallenge from './model';
import WiseMonkeysChallengeSocketHandler from './socket-handler';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';
import ChallengeController from '../../controllers/challenge.controller';

const language = {
	en: {
		title: 'Wise Monkeys',
		description: '',
		questions: [
			{
				text: 'In the "WiseMonkeys" challenge, did the mole take the exemption?',
				type: 'boolean',
				choices: [ 'Yes', 'No' ]
			}
		]
	}
};

export default class WiseMonkeysChallengeData extends ChallengeData {
	constructor() {
		super(language);
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

	initModel(players, lang) {
		let { title, description, questions } = this.lang[lang];
		this.model = new WiseMonkeysChallenge(players, title, description, questions);
	}
}
