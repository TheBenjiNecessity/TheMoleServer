import ChallengeData from '../../interfaces/challenge-data';
import Challenge from '../../models/challenge.model';
import PlatterChallengeController from './controller';
import PlatterChallenge from './model';
import PlatterChallengeSocketHandler from './socket-handler';
import SocketHandler from '../../interfaces/socket-handler';
import Controller from '../../interfaces/controller';
import RoomController from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';
import ChallengeController from '../../controllers/challenge.controller';

class PlatterChallengeData extends ChallengeData {
	constructor() {
		super('platter', 6, 4, 'game', {
			en: {
				title: 'The Platter',
				description: '',
				questions: [
					{
						text: 'In the "Platter" challenge, did the mole take the exemption?',
						type: 'boolean',
						choices: [ 'Yes', 'No' ]
					},
					{
						text: 'In the "Platter" challenge, in what position did the mole take points?',
						type: 'rank',
						choices: [ 'The mole did not take points' ]
					}
				]
			}
		});
	}

	getController(roomController: RoomController, challengeController: ChallengeController): Controller {
		return new PlatterChallengeController(roomController, challengeController);
	}
	setupSocketHandler(
		roomController: RoomController,
		webSocketService: WebSocketService,
		socket: any,
		challengeController: ChallengeController
	): SocketHandler {
		let PlatterChallengeController = this.getController(
			roomController,
			challengeController
		) as PlatterChallengeController;
		return new PlatterChallengeSocketHandler(roomController, webSocketService, socket, PlatterChallengeController);
	}
	getModel(players, lang): Challenge {
		return new PlatterChallenge(
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

export default { data: new PlatterChallengeData() };
