import ChallengeData from '../../interfaces/challenge-data';
import Challenge from '../../models/challenge.model';
import WiseMonkeysChallengeController from './controller';
import WiseMonkeysChallenge from './model';
import WiseMonkeysChallengeSocketHandler from './socket-handler';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';

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
		let wiseMonkeysChallengeController = new WiseMonkeysChallengeController(roomController);
		return new WiseMonkeysChallengeSocketHandler(
			roomController,
			webSocketService,
			socket,
			wiseMonkeysChallengeController
		);
	}

	getModel(players, lang): Challenge {
		let { title, description, questions } = this.lang[lang];
		return new WiseMonkeysChallenge(players, title, description, questions);
	}
}
