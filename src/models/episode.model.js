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

	get eliminatedPlayer() {
		let eliminatedPlayer = null;
		let totalCorrectAll = 1000;
		let timeAll = 0;
		let correctAnswers = this.molePlayer.quizAnswers.answers;
		let playersConsidered = this.players.filter((p) => !p.isMole);
		let blackExemptionPlayed = false;
		for (let player of this.players) {
			if (player.quizAnswers.usedBlackExemption) {
				blackExemptionPlayed = true;
				break;
			}
		}

		if (!blackExemptionPlayed) {
			playersConsidered = playersConsidered.filter((p) => !p.quizAnswers.usedExemption);
		}

		for (let player of playersConsidered) {
			let { quizAnswers } = player;
			let numCorrect = 0;

			for (let i = 0; i < correctAnswers.length; i++) {
				let correctAnswer = correctAnswers[i];
				let chosenAnswer = quizAnswers.answers[i];
				if (correctAnswer === chosenAnswer) {
					numCorrect++;
				}
			}

			numCorrect += player.quizAnswers.numJokersUsed;

			if (!eliminatedPlayer || numCorrect < totalCorrectAll) {
				eliminatedPlayer = player;
				totalCorrectAll = numCorrect;
				timeAll = quizAnswers.time;
			} else if (numCorrect === totalCorrectAll && quizAnswers.time > timeAll) {
				eliminatedPlayer = player;
				timeAll = quizAnswers.time;
			}
		}

		return eliminatedPlayer;
	}

	goToNextChallenge() {
		this.currentChallengeIndex++;
	}
}
