import ChallengeData from '../../interfaces/challenge-data';
import Challenge from '../../models/challenge.model';
import OutAndSafeChallengeController from './controller';
import OutAndSafeChallenge from './model';
import OutAndSafeChallengeSocketHandler from './socket-handler';
import SocketHandler from '../../interfaces/socket-handler';
import Controller from '../../interfaces/controller';
import RoomController from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';
import ChallengeController from '../../controllers/challenge.controller';

export default class OutAndSafeChallengeData extends ChallengeData {
	constructor() {
		super('out-and-safe', 10, 5, 'game', {
			en: {
				title: 'Out/Safe',
				description: '',
				questions: [
					{
						text: 'During the "Out and Safe" challenge, did the mole play an out card?',
						type: 'boolean',
						choices: [ 'Yes', 'No' ]
					}
				]
			}
		});
	}

	getController(roomController: RoomController, challengeController: ChallengeController): Controller {
		return new OutAndSafeChallengeController(roomController, challengeController);
	}
	setupSocketHandler(
		roomController: RoomController,
		webSocketService: WebSocketService,
		socket: any,
		challengeController: ChallengeController
	): SocketHandler {
		let outAndSafeChallengeController = this.getController(
			roomController,
			challengeController
		) as OutAndSafeChallengeController;
		return new OutAndSafeChallengeSocketHandler(
			roomController,
			webSocketService,
			socket,
			outAndSafeChallengeController
		);
	}
	getModel(players, lang): Challenge {
		return new OutAndSafeChallenge(
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
