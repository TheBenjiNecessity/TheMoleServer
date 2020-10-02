import ChallengeData from '../../interfaces/challenge-data';
import Challenge from '../../models/challenge.model';
import ButtonChallengeController from './controller';
import ButtonChallenge from './model';
import ButtonChallengeSocketHandler from './socket-handler';
import RoomController from '../../controllers/room.controller';
import ChallengeController from '../../controllers/challenge.controller';
import SocketHandler from '../../interfaces/socket-handler';
import WebSocketService from '../../services/websocket.service';
import Controller from '../../interfaces/controller';

export default class ButtonChallengeData extends ChallengeData {
	constructor() {
		super('button', 4, 4, 'game', {
			en: {
				title: 'The Button',
				description: '',
				questions: [
					{
						text: 'Did the mole take the jokers?',
						type: 'choices',
						choices: [ 'Yes', 'No' ]
					}
				]
			}
		});
	}

	getController(roomController: RoomController, challengeController: ChallengeController): Controller {
		return new ButtonChallengeController(roomController, challengeController);
	}
	setupSocketHandler(
		roomController: RoomController,
		webSocketService: WebSocketService,
		socket: any,
		challengeController: ChallengeController
	): SocketHandler {
		let buttonChallengeController = this.getController(
			roomController,
			challengeController
		) as ButtonChallengeController;
		return new ButtonChallengeSocketHandler(roomController, webSocketService, socket, buttonChallengeController);
	}
	getModel(players, lang): Challenge {
		return new ButtonChallenge(
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
