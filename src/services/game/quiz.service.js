import questionData from '../../models/quiz/question.data';
import Question from '../../models/quiz/question.model';
import RoomControllerCreator from '../../controllers/room.controller';
import ArrayUtilsService from '../utils/array-utils.service';

export const NUM_QUESTIONS = 10;
export const MAX_CHALLENGE_QUESTIONS = 5;
export const ranks = [ 'first', 'second', 'third', 'forth', 'fifth', 'sixth', 'seventh', 'eigth', 'nineth', 'tenth' ];

export default class QuizService {
	constructor() {}

	/**
	 * Creates a question for the final question of a quiz
	 * @param {*} room 
	 */
	static getFinalQuizQuestion(room) {
		return QuizService.createQuestion(room, 'Who is the mole?', 'player', []);
	}

	static createQuestion(room, text, type, choices) {
		switch (type) {
			case 'player':
				return new Question(text, type, room.players.filter((p) => p.eliminated).map((p) => p.name));
			case 'rank':
				let nonEliminatedPlayers = room.players.filter((p) => p.eliminated);
				let numPlayers = nonEliminatedPlayers.length;
				return new Question(text, type, ranks.splice(numPlayers, ranks.length - numPlayers));
			default:
				return new Question(text, type, choices);
		}
	}
}
