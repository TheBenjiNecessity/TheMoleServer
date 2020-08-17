import ArrayUtilsService from '../services/utils/array-utils.service';
import QuizService from '../services/game/quiz.service';

/**
 * Stores things to do with an episode
 * @property {array<Object>} challenges the list of challenges in this episode
 * @property {int} currentChallengeIndex the index of the challenge currently being played
 * @property {array<Object>} players the players playing in this episode
 */
export default class Episode {
	constructor(playersStillPlaying, challenges, unusedGeneralQuizQuestions) {
		this.currentChallengeIndex = 0;
		this.challenges = challenges;
		this.players = playersStillPlaying;

		let questionsArray = ArrayUtilsService.array2dTo1d(this.challenges.map((c) => c.questions));
		this.quiz = QuizService.generateQuiz(this.players, questionsArray, unusedGeneralQuizQuestions);
	}

	get currentChallenge() {
		if (this.episodeIsOver) {
			return null;
		}

		return this.challenges[this.currentChallengeIndex];
	}

	get episodeIsOver() {
		return this.currentChallengeIndex >= this.challenges.length;
	}

	goToNextChallenge() {
		this.currentChallengeIndex++;
	}
}
