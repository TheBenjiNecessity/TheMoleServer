import ChallengeController from '../controllers/challenge.controller';
import RoomController from '../controllers/room.controller';
import ChallengeData from '../interfaces/challenge-data';
import QuizService from '../services/game/quiz.service';
import Challenge from './challenge.model';
import Player from './player.model';
import Question from './quiz/question.model';
import QuizAnswers from './quiz/quiz-answers.model';
import Quiz from './quiz/quiz.model';

/**
 * Stores things to do with an episode
 * @property {array<Object>} challenges the list of challenges in this episode
 * @property {int} currentChallengeIndex the index of the challenge currently being played
 * @property {array<Object>} players the players playing in this episode
 * @property {Object} quiz the quiz at the end of this episode
 */
export default class Episode {
	private _eliminatedPlayer: Player;

	currentChallengeIndex: number;
	players: Player[];
	quiz: Quiz;

	constructor(
		playersStillPlaying: Player[],
		private challengeData: ChallengeData[],
		unusedGeneralQuizQuestions: Question[]
	) {
		this.currentChallengeIndex = 0;
		this.players = playersStillPlaying;

		let questionsArray = [].concat(...this.challengeData.map((c) => c.model.questions));
		this.quiz = QuizService.generateQuiz(this.players, questionsArray, unusedGeneralQuizQuestions);
	}

	get currentChallenge(): Challenge {
		if (this.episodeIsOver) {
			return null;
		}

		return this.challengeData[this.currentChallengeIndex].model;
	}

	get episodeIsOver(): boolean {
		return this.currentChallengeIndex >= this.challengeData.length;
	}

	get molePlayer(): Player {
		return this.players.find((p) => p.isMole);
	}

	get eliminatedPlayer(): Player {
		if (!this.episodeIsOver) {
			this._eliminatedPlayer = null;
			return null;
		}

		if (this._eliminatedPlayer) {
			return this._eliminatedPlayer;
		}

		let eliminatedPlayer = null;
		let totalCorrectAll = 1000; // Keep track of the score for the worst test
		let timeAll = 0;
		let correctAnswers = this.molePlayer.quizAnswers.answers;
		let playersConsidered = this.players.filter((p) => !p.isMole);
		let blackExemptionPlayed = typeof this.players.find((p) => p.quizAnswers.usedBlackExemption) !== 'undefined';

		if (!blackExemptionPlayed) {
			// Remove players from list of considered players to be eliminated if that player played
			// an exemption
			playersConsidered = playersConsidered.filter((p) => !p.quizAnswers.usedExemption);
		}

		for (let player of playersConsidered) {
			let { quizAnswers } = player;
			let numCorrect = quizAnswers.getScore(correctAnswers);

			if (!blackExemptionPlayed) {
				numCorrect += player.quizAnswers.numJokersUsed;
			}

			if (!eliminatedPlayer || numCorrect < totalCorrectAll) {
				eliminatedPlayer = player;
				totalCorrectAll = numCorrect;
				timeAll = quizAnswers.time;
			} else if (numCorrect === totalCorrectAll && quizAnswers.time > timeAll) {
				eliminatedPlayer = player;
				timeAll = quizAnswers.time;
			}
		}

		this._eliminatedPlayer = eliminatedPlayer;
		return eliminatedPlayer;
	}

	get allPlayersFinishedQuiz(): boolean {
		let playersWhoFinished = this.players.filter(
			(p) => p.quizAnswers && p.quizAnswers.answers.length > 0 && p.quizAnswers.time > 0
		);
		return playersWhoFinished.length === this.players.length;
	}

	get challengeTypes(): string[] {
		return this.challengeData.map((cd) => cd.type);
	}

	setQuizResultsForPlayer(playerName: string, quizAnswers: QuizAnswers) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].name === playerName) {
				this.players[i].quizAnswers = quizAnswers;
				break;
			}
		}
	}

	goToNextChallenge() {
		this.currentChallengeIndex++;
	}

	getCurrentChallengeController(roomController: RoomController): ChallengeController {
		if (this.episodeIsOver) {
			return null;
		}

		return this.challengeData[this.currentChallengeIndex].getController(roomController);
	}
}
