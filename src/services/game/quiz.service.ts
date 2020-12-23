import Question from '../../models/quiz/question.model';
import Quiz from '../../models/quiz/quiz.model';
import { MAX_NUM_QUESTIONS, RANKS } from '../../contants/quiz.constants';
import Player from '../../models/player.model';
import Room from '../../models/room.model';

export default class QuizService {
	constructor() {}

	/**
	 * Creates a question for the final question of a quiz
	 * @param {*} room 
	 */
	static getFinalQuizQuestion(playersStillPlaying: Player[]): Question {
		// TODO l10n
		return QuizService.createQuestion('Who is the mole?', 'player', [], playersStillPlaying);
	}

	static createQuestion(
		text: string,
		type: string,
		choices: string[] = [],
		playersStillPlaying: Player[] = []
	): Question {
		switch (type) {
			case 'player':
				let playerNames = playersStillPlaying.map((p: Player) => p.name);
				return { text, type, choices: playerNames };
			case 'rank':
				let numPlayers = playersStillPlaying.length;
				let ranks = RANKS.slice(0, numPlayers);
				return { text, type, choices: ranks };
			default:
				return { text, type, choices };
		}
	}

	static generateQuiz(
		playersStillPlaying: Player[],
		challengeQuestions: Question[],
		unusedGeneralQuestions: Question[]
	): Quiz {
		let questions = [];
		challengeQuestions.shuffle();
		unusedGeneralQuestions.shuffle();

		challengeQuestions = challengeQuestions.slice(0, Room.MAX_CHALLENGE_QUESTIONS);
		questions = challengeQuestions;
		unusedGeneralQuestions = unusedGeneralQuestions.slice(0, MAX_NUM_QUESTIONS - questions.length - 1);
		questions = questions.concat(unusedGeneralQuestions);
		questions.shuffle();
		questions.push(QuizService.getFinalQuizQuestion(playersStillPlaying));

		return { questions };
	}
}
