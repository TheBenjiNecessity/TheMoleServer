import ChallengeData from '../../interfaces/challenge-data';
import Challenge from '../../models/challenge.model';
import StacksChallengeController from './controller';
import StacksChallenge from './model';
import StacksChallengeSocketHandler from './socket-handler';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';
import ChallengeController from '../../controllers/challenge.controller';

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

	getController(roomController: RoomController): ChallengeController {
		return new StacksChallengeController(roomController);
	}
	setupSocketHandler(roomController: RoomController, webSocketService: WebSocketService, socket: any): SocketHandler {
		let stacksChallengeController = this.getController(roomController) as StacksChallengeController;
		return new StacksChallengeSocketHandler(roomController, webSocketService, socket, stacksChallengeController);
	}
	getModel(players, lang): Challenge {
		let { title, description, questions } = this.lang[lang];
		return new StacksChallenge(players, title, description, questions);
	}
}
