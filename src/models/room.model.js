import questionData from '../models/quiz/question.data';
import ArrayUtilsService from '../services/utils/array-utils.service';
import Question from '../models/quiz/question.model';
import challengeData from './challenges/challenge.data';

export const MAX_CHALLENGE_QUESTIONS = 5;

export const ROOM_STATE = {
	LOBBY: 'lobby',
	WELCOME: 'game-welcome',
	EPISODESTART: 'episode-start'
};

export const ROOM_MAX_PLAYERS = 10;

export default class Room {
	get isFull() {
		return this.players.length === ROOM_MAX_PLAYERS;
	}

	get isStateWelcome() {
		return this.state === ROOM_STATE.WELCOME;
	}

	constructor(roomcode) {
		this.roomcode = roomcode;
		this.state = ROOM_STATE.LOBBY;
		this.players = [];
		this.currentEpisode = null;
		this.unusedChallenges = challengeData;
		this.currentChallenge = null;
		this.isInProgress = false;
		this.points = 0;
		this.unaskedQuestions = questionData.map((qd) => new Question(qd.text, qd.type, qd.choices));
	}

	addPlayer(player) {
		if (this.isFull || this.isInProgress) {
			return false;
		}

		if (this.players.find((p) => p.name === player.name)) {
			return false;
		}

		this.players.push(player);
		return true;
	}

	moveNext() {
		switch (this.state) {
			case ROOM_STATE.LOBBY:
				this.state = ROOM_STATE.WELCOME;
				return true;
			case ROOM_STATE.WELCOME:
				this.state = ROOM_STATE.EPISODESTART;
				this.currentChallenge = this.currentEpisode.currentChallenge;
				return true;
			default:
				return false;
		}
	}

	hasPlayer(playerName) {
		let roomPlayer = this.players.find((p) => p.name === playerName);
		return typeof roomPlayer !== 'undefined';
	}

	giveObjectsToPlayer(playerName, object, quantity) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].name === playerName) {
				this.players[i].setObjects(object, quantity);
				break;
			}
		}
	}

	removeObjectsFromPlayer(playerName, object, quantity) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].name === playerName) {
				this.players[i].removeObjects(object, quantity);
				break;
			}
		}
	}

	addPoints(points = 1) {
		this.points += points;
	}

	removePoints(points = 1) {
		this.points -= points;

		if (this.points < 0) {
			this.points = 0;
		}
	}

	getRandomUnusedChallenge(numPlayers) {
		let numRestrictedChallenges = this.unusedChallenges.filter(
			(c) => c.maxPlayers >= numPlayers && c.minPlayers <= numPlayers
		);
		let randomIndex = ArrayUtilsService.getRandomIndex(numRestrictedChallenges);
		let randomChallenge = numRestrictedChallenges[randomIndex];
		this.unusedChallenges = this.unusedChallenges.filter((c) => c.type === randomChallenge.type);
		return randomChallenge;
	}

	getRandomUnaskedQuestion() {
		let randomIndex = ArrayUtilsService.getRandomIndex(this.unaskedQuestions);
		let randomQuestion = this.unaskedQuestions[randomIndex];
		this.unaskedQuestions = ArrayUtilsService.removeElementAt(this.unaskedQuestions, randomIndex);
		return randomQuestion;
	}

	getQuiz() {
		if (this.episodes.length === 0) {
			return null;
		}

		let questions = [];
		let episodeQuestions = currentEpisode.getQuestions();
		episodeQuestions = ArrayUtilsService.shuffleArray(episodeQuestions);
		episodeQuestions = episodeQuestions.slice(0, MAX_CHALLENGE_QUESTIONS);
		for (let eq of episodeQuestions) {
			questions.push(eq);
		}

		for (let i = 0; i < NUM_QUESTIONS - questions.length - 1; i++) {
			questions.push(room.getRandomUnaskedQuestion());
		}

		questions = ArrayUtilsService.shuffleArray(questions);
		questions.push(QuizService.getFinalQuizQuestion(room));
	}
}
