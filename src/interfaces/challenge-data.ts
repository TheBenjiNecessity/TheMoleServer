import Challenge from '../models/challenge.model';
import Player from '../models/player.model';
import Question from '../models/quiz/question.model';
import RoomController from '../controllers/room.controller';
import WebSocketService from '../services/websocket.service';
import SocketHandler from './socket-handler';
import ChallengeController from '../controllers/challenge.controller';
import Localization, { LanguageData } from '../models/l10n.model';

export interface ChallengeLanguageData extends LanguageData {
	title: string;
	description: string;
	questions: Question[];
}

export class ChallengeLocalization extends Localization {
	constructor(languageData: { [code: string]: ChallengeLanguageData }) {
		super(languageData);
	}
}

export default abstract class ChallengeData {
	model: Challenge;

	constructor(private localization: ChallengeLocalization) {}

	abstract get type(): string;
	abstract get maxPlayers(): number;
	abstract get minPlayers(): number;

	abstract setupSocketHandler(
		roomController: RoomController,
		webSocketService: WebSocketService,
		socket: any
	): SocketHandler;
	abstract initModel(players: Player[], languageCode: string);
	abstract getController(roomController: RoomController): ChallengeController;

	getQuestions(languageCode: string): Question[] {
		return this.localization.getText(languageCode, 'questions');
	}

	getDescription(languageCode: string): string {
		return this.localization.getText(languageCode, 'description');
	}

	getTitle(languageCode: string): string {
		return this.localization.getText(languageCode, 'title');
	}
}
