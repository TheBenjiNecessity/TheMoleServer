import Challenge from '../models/challenge.model';
import Player from '../models/player.model';
import Question from '../models/quiz/question.model';
import RoomController from '../controllers/room.controller';
import WebSocketService from '../services/websocket.service';
import SocketHandler from './socket-handler';
import ChallengeController from '../controllers/challenge.controller';

interface LanguageData {
	title: string;
	description: string;
	questions: Question[];
}

export default abstract class ChallengeData {
	model: Challenge;

	constructor(public lang: { [code: string]: LanguageData }) {}

	abstract get type(): string;
	abstract get maxPlayers(): number;
	abstract get minPlayers(): number;

	abstract setupSocketHandler(
		roomController: RoomController,
		webSocketService: WebSocketService,
		socket: any
	): SocketHandler;
	abstract initModel(players: Player[], lang: string);
	abstract getController(roomController: RoomController): ChallengeController;

	getQuestions(language: string): Question[] {
		return this.lang[language].questions;
	}
}
