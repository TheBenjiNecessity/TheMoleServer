import ChallengeData from '../../interfaces/challenge-data';
import Challenge from '../../models/challenge.model';
import TradersChallengeController from './controller';
import TradersChallenge from './model';
import TradersChallengeSocketHandler from './socket-handler';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';
import ChallengeController from '../../controllers/challenge.controller';

const language = {
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
	}
};

export default class TradersChallengeData extends ChallengeData {
	constructor() {
		super(language);
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

	initModel(players, lang) {
		let { title, description, questions } = this.lang[lang];
		this.model = new TradersChallenge(players, title, description, questions);
	}
}
