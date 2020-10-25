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
	constructor(public lang: { [code: string]: LanguageData }) {}

	abstract setupSocketHandler(
		roomController: RoomController,
		webSocketService: WebSocketService,
		socket: any
	): SocketHandler;
	abstract getModel(players: Player[], lang: string): Challenge;
}
