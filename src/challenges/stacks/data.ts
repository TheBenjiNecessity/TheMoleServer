import ChallengeData from '../../interfaces/challenge-data';
import Challenge from '../../models/challenge.model';
import StacksChallengeController from './controller';
import StacksChallenge from './model';
import StacksChallengeSocketHandler from './socket-handler';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';
import ChallengeController from '../../controllers/challenge.controller';

const language = {
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
	}
};

export default class StacksChallengeData extends ChallengeData {
	constructor() {
		super(language);
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

	initModel(players, lang) {
		let { title, description, questions } = this.lang[lang];
		this.model = new StacksChallenge(players, title, description, questions);
	}
}
