import ChallengeData, { ChallengeLanguageData, ChallengeLocalization } from '../../interfaces/challenge-data';
import PathChallengeController from './controller';
import PathChallenge from './model';
import PathChallengeSocketHandler from './socket-handler';
import SocketHandler from '../../interfaces/socket-handler';
import RoomController from '../../controllers/room.controller';
import WebSocketService from '../../services/websocket.service';
import ChallengeController from '../../controllers/challenge.controller';
import Player from '../../models/player.model';

const challengeLanguageData = {
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
	} as ChallengeLanguageData
};

export default class PathChallengeData extends ChallengeData {
	constructor() {
		super(new ChallengeLocalization(challengeLanguageData));
	}

	get type(): string {
		return 'path';
	}

	get maxPlayers(): number {
		return 5;
	}

	get minPlayers(): number {
		return 5;
	}

	setupSocketHandler(roomController: RoomController, webSocketService: WebSocketService, socket: any): SocketHandler {
		let pathChallengeController = this.getController(roomController) as PathChallengeController;
		return new PathChallengeSocketHandler(roomController, webSocketService, socket, pathChallengeController);
	}

	getController(roomController): ChallengeController {
		return new PathChallengeController(roomController);
	}

	initModel(players: Player[], languageCode: string) {
		this.model = new PathChallenge(
			players,
			this.getTitle(languageCode),
			this.getDescription(languageCode),
			this.getQuestions(languageCode)
		);
	}
}
