import ChallengeData from '../../interfaces/challenge-data';
import Challenge from '../../models/challenge.model';
import StacksChallengeController from './controller';
import StacksChallenge from './model';
import StacksChallengeSocketHandler from './socket-handler';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';

export default class StacksChallengeData extends ChallengeData {
	constructor() {
		super({
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
		});
	}

	setupSocketHandler(roomController: RoomController, webSocketService: WebSocketService, socket: any): SocketHandler {
		let stacksChallengeController = new StacksChallengeController(roomController);
		return new StacksChallengeSocketHandler(roomController, webSocketService, socket, stacksChallengeController);
	}

	getModel(players, lang): Challenge {
		let { title, description, questions } = this.lang[lang];
		return new StacksChallenge(players, title, description, questions);
	}
}
