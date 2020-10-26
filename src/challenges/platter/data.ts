import ChallengeData from '../../interfaces/challenge-data';
import Challenge from '../../models/challenge.model';
import PlatterChallengeController from './controller';
import PlatterChallenge from './model';
import PlatterChallengeSocketHandler from './socket-handler';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';

export default class PlatterChallengeData extends ChallengeData {
	constructor() {
		super({
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

	get type(): string {
		return 'platter';
	}

	get maxPlayers(): number {
		return 6;
	}

	get minPlayers(): number {
		return 4;
	}

	setupSocketHandler(roomController: RoomController, webSocketService: WebSocketService, socket: any): SocketHandler {
		let platterChallengeController = new PlatterChallengeController(roomController);
		return new PlatterChallengeSocketHandler(roomController, webSocketService, socket, platterChallengeController);
	}

	getModel(players, lang): Challenge {
		let { title, description, questions } = this.lang[lang];
		return new PlatterChallenge(players, title, description, questions);
	}
}
