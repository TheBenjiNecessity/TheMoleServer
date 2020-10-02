import ChallengeData from '../../interfaces/challenge-data';
import Challenge from '../../models/challenge.model';
import StacksChallengeController from './controller';
import StacksChallenge from './model';
import StacksChallengeSocketHandler from './socket-handler';
import SocketHandler from '../../interfaces/socket-handler';
import Controller from '../../interfaces/controller';
import RoomController from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';
import ChallengeController from '../../controllers/challenge.controller';

export default class StacksChallengeData extends ChallengeData {
	constructor() {
		super('stacks', 6, 6, 'game', {
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

	getController(roomController: RoomController, challengeController: ChallengeController): Controller {
		return new StacksChallengeController(roomController, challengeController);
	}
	setupSocketHandler(
		roomController: RoomController,
		webSocketService: WebSocketService,
		socket: any,
		challengeController: ChallengeController
	): SocketHandler {
		let StacksChallengeController = this.getController(
			roomController,
			challengeController
		) as StacksChallengeController;
		return new StacksChallengeSocketHandler(roomController, webSocketService, socket, StacksChallengeController);
	}
	getModel(players, lang): Challenge {
		return new StacksChallenge(
			players,
			this.lang[lang].title,
			this.lang[lang].description,
			this.maxPlayers,
			this.minPlayers,
			this.lang[lang].questions,
			this.initialState
		);
	}
}
