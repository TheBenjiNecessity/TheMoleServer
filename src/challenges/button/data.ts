import ChallengeData from '../../interfaces/challenge-data';
import Challenge from '../../models/challenge.model';
import ButtonChallengeController from './controller';
import ButtonChallenge from './model';
import ButtonChallengeSocketHandler from './socket-handler';
import RoomController from '../../controllers/room.controller';
import SocketHandler from '../../interfaces/socket-handler';
import WebSocketService from '../../services/websocket.service';

const language = {
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
};

export default class ButtonChallengeData extends ChallengeData {
	constructor() {
		super(language);
	}

	get type(): string {
		return 'button';
	}

	get maxPlayers(): number {
		return 4;
	}

	get minPlayers(): number {
		return 4;
	}

	setupSocketHandler(roomController: RoomController, webSocketService: WebSocketService, socket: any): SocketHandler {
		let buttonChallengeController = new ButtonChallengeController(roomController);
		return new ButtonChallengeSocketHandler(roomController, webSocketService, socket, buttonChallengeController);
	}

	getModel(players, lang): Challenge {
		let { title, description, questions } = this.lang[lang];
		return new ButtonChallenge(players, title, description, questions);
	}
}
