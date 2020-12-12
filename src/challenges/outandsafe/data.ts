import ChallengeData from '../../interfaces/challenge-data';
import Challenge from '../../models/challenge.model';
import OutAndSafeChallengeController from './controller';
import OutAndSafeChallenge from './model';
import OutAndSafeChallengeSocketHandler from './socket-handler';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';
import ChallengeController from '../../controllers/challenge.controller';

const language = {
	en: {
		title: 'Out and Safe',
		description: '',
		questions: [
			{
				text: 'During the "Out and Safe" challenge, did the mole play an out card?',
				type: 'boolean',
				choices: [ 'Yes', 'No' ]
			}
		]
	}
};

export default class OutAndSafeChallengeData extends ChallengeData {
	constructor() {
		super(language);
	}

	get type(): string {
		return 'outandsafe';
	}

	get maxPlayers(): number {
		return 10;
	}

	get minPlayers(): number {
		return 5;
	}

	setupSocketHandler(roomController: RoomController, webSocketService: WebSocketService, socket: any): SocketHandler {
		let outAndSafeChallengeController = this.getController(roomController) as OutAndSafeChallengeController;
		return new OutAndSafeChallengeSocketHandler(
			roomController,
			webSocketService,
			socket,
			outAndSafeChallengeController
		);
	}

	getController(roomController): ChallengeController {
		return new OutAndSafeChallengeController(roomController);
	}

	initModel(players, lang) {
		let { title, description, questions } = this.lang[lang];
		this.model = new OutAndSafeChallenge(players, title, description, questions);
	}
}
