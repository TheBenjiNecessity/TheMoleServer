import questionData from '../models/quiz/question.data';
import ArrayUtilsService from '../services/utils/array-utils.service';
import EpisodeService from '../services/game/episode.service';
import ChallengeService from '../services/game/challenge.service';
import challengeData from './challenges/challenge.data';

export const MAX_CHALLENGE_QUESTIONS = 5;
export const ROOM_MAX_PLAYERS = 10;
export const ROOM_STATE = {
	LOBBY: 'lobby',
	WELCOME: 'game-welcome',
	EPISODE_START: 'episode-start',
	CHALLENGE_INTERMISSION: 'challenge-intermission',
	IN_CHALLENGE: 'in-episode',
	PRE_QUIZ_INTERMISSION: 'pre-quiz-intermission',
	IN_QUIZ: 'in-episode',
	POST_QUIZ_INTERMISSION: 'post-quiz-intermission',
	EXECUTION: 'execution',
	EXECUTION_WRAPUP: 'execution-wrapup'
};

export default class Room {
	constructor(roomcode) {
		this.roomcode = roomcode;
		this.state = ROOM_STATE.LOBBY;
		this.players = [];
		this._currentEpisode = null;
		this.unusedChallenges = challengeData;
		this.currentChallenge = null;
		this.isInProgress = false;
		this.points = 0;
		this.unaskedQuestions = questionData;
	}

	get isFull() {
		return this.players.length === ROOM_MAX_PLAYERS;
	}

	get playersStillPlaying() {
		return this.players.filter((p) => !p.eliminated);
	}

	get currentEpisode() {
		return this._currentEpisode;
	}

	set currentEpisode(episode) {
		this._currentEpisode = episode;
		for (let challenge of episode.challenges) {
			this.removeUnusedChallenge(challenge.type);
		}
	}

	get numChallengesPerEpisode() {
		if (!this.isInProgress) {
			return -1;
		}

		return EpisodeService.getNumChallenges(this.players.length);
	}

	get numRestrictedChallenges() {
		let numPlayers = this.playersStillPlaying.length;
		return this.unusedChallenges.filter((c) => c.maxPlayers >= numPlayers && c.minPlayers <= numPlayers);
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

	removePlayer(playerName) {
		if (this.isInProgress) {
			throw 'Cannot remove player from game in progress';
		}

		this.players = this.players.filter((p) => p.name === playerName);
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

	removeUnaskedQuestion(text) {
		this.unaskedQuestions = this.unaskedQuestions.filter((q) => q.text !== text);
	}

	removeUnusedChallenge(type) {
		this.unusedChallenges = this.unusedChallenges.filter((c) => c.type !== type);
	}

	generateCurrentEpisode() {
		let challenges = [];
		for (let i = 0; i < this.numChallengesPerEpisode; i++) {
			let numRestrictedChallenges = this.numRestrictedChallenges;
			numRestrictedChallenges = numRestrictedChallenges.filter(
				(c) => !challenges.map((used) => used.type).includes(c.type)
			);
			numRestrictedChallenges = ArrayUtilsService.shuffleArray(numRestrictedChallenges);
			challenges.push(ChallengeService.getChallengeForType(numRestrictedChallenges[0].type, this));
		}

		return new Episode(this.playersStillPlaying.length, challenges, this.unaskedQuestions);
	}
}
