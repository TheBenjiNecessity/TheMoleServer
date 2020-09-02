import Question from '../../models/quiz/question.model';
import Quiz from '../../models/quiz/quiz.model';
import { MAX_CHALLENGE_QUESTIONS } from '../../contants/room.constants';
import { MAX_NUM_QUESTIONS, RANKS } from '../../contants/quiz.constants';

export default class QuizService {
	constructor() {}

	/**
	 * Creates a question for the final question of a quiz
	 * @param {*} room 
	 */
	static getFinalQuizQuestion(playersStillPlaying) {
		return QuizService.createQuestion(playersStillPlaying, 'Who is the mole?', 'player', []);
	}

	static createQuestion(playersStillPlaying, text, type, choices) {
		switch (type) {
			case 'player':
				return new Question(text, type, playersStillPlaying.map((p) => p.name));
			case 'rank':
				let numPlayers = playersStillPlaying.length;
				return new Question(text, type, RANKS.slice(0, numPlayers));
			default:
				return new Question(text, type, choices);
		}
	}

	static generateQuiz(playersStillPlaying, challengeQuestions, unusedGeneralQuestions) {
		let questions = [];
		challengeQuestions.shuffle();
		unusedGeneralQuestions.shuffle();

		challengeQuestions = challengeQuestions.slice(0, MAX_CHALLENGE_QUESTIONS);
		questions = challengeQuestions;
		unusedGeneralQuestions = unusedGeneralQuestions.slice(0, MAX_NUM_QUESTIONS - questions.length - 1);
		questions = questions.concat(unusedGeneralQuestions);
		questions.shuffle();
		questions.push(QuizService.getFinalQuizQuestion(playersStillPlaying));

		return new Quiz(questions);
	}
}
