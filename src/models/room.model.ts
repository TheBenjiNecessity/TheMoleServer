import questionData from './quiz/question.data';
import EpisodeService from '../services/game/episode.service';
import ChallengeService from '../services/game/challenge.service';
import { ROOM_MAX_PLAYERS, ROOM_STATE } from '../contants/room.constants';
import Episode from './episode.model';
import '../extensions/array';
import ChallengeData from '../interfaces/challenge-data';
import Player from './player.model';

export interface IMoleChooser {
	getMoleIndex(players: Player[]);
}

class MoleChooser implements IMoleChooser {
	constructor() {}

	getMoleIndex(players: Player[]) {
		return players.randomIndex();
	}
}

export default class Room {
	private _state: string;
	private _currentEpisode: Episode;
	private _players: Player[];

	unusedChallenges: ChallengeData[];
	isInProgress: boolean;
	points: number;
	unaskedQuestions: any[];

	constructor(
		public roomcode: string,
		private language: string,
		private moleChooser: IMoleChooser = new MoleChooser()
	) {
		this._state = ROOM_STATE.LOBBY;
		this.unaskedQuestions = questionData;

		this._players = [];
		this._currentEpisode = null;
		this.unusedChallenges = [];
		this.isInProgress = false;
		this.points = 0;
	}

	get isFull() {
		return this._players.length === ROOM_MAX_PLAYERS;
	}

	get playersStillPlaying() {
		return this._players.filter((p) => !p.eliminated);
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

	get numRestrictedChallenges() {
		let numPlayers = this.playersStillPlaying.length;
		return this.unusedChallenges.filter((c) => c.maxPlayers >= numPlayers && c.minPlayers <= numPlayers);
	}

	get molePlayer() {
		return this._players.find((p) => p.isMole);
	}

	get state() {
		return this._state;
	}

	set state(newState) {
		this._state = newState;

		switch (this.state) {
			case ROOM_STATE.WELCOME:
				this.isInProgress = true;
				this.chooseMole();
				break;
			case ROOM_STATE.EPISODE_START:
				this.generateCurrentEpisode();
				break;
			case ROOM_STATE.CHALLENGE_INTERMISSION:
				this.currentEpisode.goToNextChallenge();
				break;
			case ROOM_STATE.EXECUTION:
				let executedPlayer = this.currentEpisode.eliminatedPlayer;

				for (let i = 0; i < this._players.length; i++) {
					if (executedPlayer.name === this._players[i].name) {
						this._players[i].eliminated = true;
						break;
					}
				}
				break;
			case ROOM_STATE.EPISODE_START:
				break;
			default:
				break;
		}
	}

	addPlayer(player): boolean {
		if (this.isFull || this.isInProgress) {
			return false;
		}

		if (this._players.find((p) => p.name === player.name)) {
			return false;
		}

		this._players.push(player);
		return true;
	}

	removePlayer(playerName): void {
		if (this.isInProgress) {
			throw 'Cannot remove player from game in progress';
		}

		this._players = this._players.filter((p) => p.name === playerName);
	}

	hasPlayer(playerName): boolean {
		let roomPlayer = this._players.find((p) => p.name === playerName);
		return typeof roomPlayer !== 'undefined';
	}

	giveObjectsToPlayer(playerName, object, quantity = 1): void {
		for (let i = 0; i < this._players.length; i++) {
			if (this._players[i].name === playerName) {
				this._players[i].setObjects(object, quantity);
				break;
			}
		}
	}

	removeObjectsFromPlayer(playerName, object, quantity = 1): void {
		for (let i = 0; i < this._players.length; i++) {
			if (this._players[i].name === playerName) {
				this._players[i].removeObjects(object, quantity);
				break;
			}
		}
	}

	addPoints(points = 1): void {
		this.points += Math.abs(points);
	}

	removePoints(points = 1): void {
		this.points -= Math.abs(points);

		if (this.points < 0) {
			this.points = 0;
		}
	}

	removeUnaskedQuestion(text): void {
		this.unaskedQuestions = this.unaskedQuestions.filter((q) => q.text !== text);
	}

	removeUnusedChallenge(type): void {
		this.unusedChallenges = this.unusedChallenges.filter((c) => c.type !== type);
	}

	addChallengeData(challengeData): void {
		this.unusedChallenges = challengeData;
	}

	moveNext(): boolean {
		switch (this.state) {
			case ROOM_STATE.LOBBY:
				this.state = ROOM_STATE.WELCOME;
				break;
			case ROOM_STATE.WELCOME:
				this.state = ROOM_STATE.EPISODE_START;
				break;
			case ROOM_STATE.EPISODE_START:
				this.state = ROOM_STATE.IN_CHALLENGE;
				break;
			case ROOM_STATE.IN_CHALLENGE:
				this.state = ROOM_STATE.CHALLENGE_INTERMISSION;
				break;
			case ROOM_STATE.CHALLENGE_INTERMISSION:
				if (this.currentEpisode.episodeIsOver) {
					this.state = ROOM_STATE.PRE_QUIZ_INTERMISSION;
				} else {
					this.state = ROOM_STATE.IN_CHALLENGE;
				}
				break;
			case ROOM_STATE.PRE_QUIZ_INTERMISSION:
				this.state = ROOM_STATE.IN_QUIZ;
				break;
			case ROOM_STATE.IN_QUIZ:
				this.state = ROOM_STATE.POST_QUIZ_INTERMISSION;
				break;
			case ROOM_STATE.POST_QUIZ_INTERMISSION:
				this.state = ROOM_STATE.EXECUTION;
				break;
			case ROOM_STATE.EXECUTION:
				this.state = ROOM_STATE.EXECUTION_WRAPUP;
				break;
			case ROOM_STATE.EXECUTION_WRAPUP:
				this.state = ROOM_STATE.EPISODE_START;
				break;
			default:
				return false;
		}
		return true;
	}

	generateCurrentEpisode() {
		let challenges = [];
		let numChallenges = EpisodeService.getNumChallenges(this._players.length);
		for (let i = 0; i < numChallenges; i++) {
			let numRestrictedChallenges = ChallengeService.listChallengesForNumPlayers(
				this.playersStillPlaying.length,
				this.unusedChallenges,
				challenges
			);

			if (numRestrictedChallenges.length <= 0) {
				//TODO could cause episode to have fewer challenges than should
				continue;
			}

			numRestrictedChallenges.shuffle();
			challenges.push(numRestrictedChallenges[0].getModel(this.playersStillPlaying, this.language));
		}

		this.currentEpisode = new Episode(this.playersStillPlaying, challenges, this.unaskedQuestions);
	}

	chooseMole() {
		if (!this._players.length) {
			return;
		}

		for (let i = 0; i < this._players.length; i++) {
			this._players[i].isMole = false;
		}

		this._players[this.moleChooser.getMoleIndex(this._players)].isMole = true;
	}
}
