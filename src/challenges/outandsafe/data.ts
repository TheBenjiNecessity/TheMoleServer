import ChallengeData from '../../interfaces/challenge-data';
import Challenge from '../../models/challenge.model';
import OutAndSafeChallengeController from './controller';
import OutAndSafeChallenge from './model';
import OutAndSafeChallengeSocketHandler from './socket-handler';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';

export default class OutAndSafeChallengeData extends ChallengeData {
	constructor() {
		super({
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
		});
	}

	get type(): string {
		return 'outandsafe';
	}

	get minPlayers(): number {
		return 5;
	}

	setupSocketHandler(roomController: RoomController, webSocketService: WebSocketService, socket: any): SocketHandler {
		let outAndSafeChallengeController = new OutAndSafeChallengeController(roomController);
		return new OutAndSafeChallengeSocketHandler(
			roomController,
			webSocketService,
			socket,
			outAndSafeChallengeController
		);
	}

	getModel(players, lang): Challenge {
		let { title, description, questions } = this.lang[lang];
		return new OutAndSafeChallenge(players, title, description, questions);
	}
}
