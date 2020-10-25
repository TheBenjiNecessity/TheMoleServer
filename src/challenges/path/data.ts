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
		super('path', 5, 5, 'walker', {
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

	getController(roomController: RoomController): ChallengeController {
		return new PathChallengeController(roomController);
	}
	setupSocketHandler(roomController: RoomController, webSocketService: WebSocketService, socket: any): SocketHandler {
		let PathChallengeController = this.getController(roomController) as PathChallengeController;
		return new PathChallengeSocketHandler(roomController, webSocketService, socket, PathChallengeController);
	}
	getModel(players, lang): Challenge {
		return new PathChallenge(
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
