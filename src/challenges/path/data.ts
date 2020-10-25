import ChallengeData from '../../interfaces/challenge-data';
import Challenge from '../../models/challenge.model';
import PathChallengeController from './controller';
import PathChallenge from './model';
import PathChallengeSocketHandler from './socket-handler';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';
import ChallengeController from '../../controllers/challenge.controller';

export default class PathChallengeData extends ChallengeData {
	constructor() {
		super({
			en: {
				title: 'The Path',
				description: '',
				questions: [
					{
						text: 'In "The Path" challenge, what position did the mole walk the path?',
						type: 'rank',
						choices: []
					},
					{
						text: 'In "The Path" challenge, did the mole make it to the end?',
						type: 'choices',
						choices: [ 'Yes', 'No' ]
					},
					{
						text: 'In "The Path" challenge, what reward or punishment did the mole take?',
						type: 'choices',
						choices: [ 'An exemption', 'A black exemption', 'A joker', 'Two jokers', 'negative points' ]
					}
				]
			}
		});
	}

	setupSocketHandler(roomController: RoomController, webSocketService: WebSocketService, socket: any): SocketHandler {
		let pathChallengeController = new PathChallengeController(roomController);
		return new PathChallengeSocketHandler(roomController, webSocketService, socket, pathChallengeController);
	}

	getModel(players, lang): Challenge {
		let { title, description, questions } = this.lang[lang];
		return new PathChallenge(players, title, description, questions);
	}
}
