import Challenge from '../models/challenge.model';
import Player from '../models/player.model';
import Question from '../models/quiz/question.model';
import IController from './controller.interface';
import ISocketHandler from './socket-handler.interface';

interface LanguageData {
	title: string;
	description: string;
	questions: Question[];
}

export default abstract class ChallengeData {
	constructor(
		public type: string,
		public maxPlayers: number,
		public minPlayers: number,
		public initialState: string,
		public lang: { [code: string]: LanguageData }
	) {}

	abstract getController(): IController;
	abstract getSocketHandler(): ISocketHandler;
	abstract getModel(players: Player[], lang: string): Challenge;
}
