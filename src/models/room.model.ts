import questionData from './quiz/question.data';
import EpisodeService from '../services/game/episode.service';
import ChallengeService from '../services/game/challenge.service';
import Episode from './episode.model';
import '../extensions/array';
import ChallengeData from '../interfaces/challenge-data';
import Player from './player.model';
import StateObject from './stateObject.interface';
import Question from './quiz/question.model';
import { DATETIME } from '../contants/datetime.constants';

export interface IMoleChooser {
	getMoleIndex(players: Player[]);
}

class MoleChooser implements IMoleChooser {
	constructor() {}

	getMoleIndex(players: Player[]) {
		return players.randomIndex();
	}
}

export interface IEpisodeGenerator {
	generateCurrentEpisode(
		numChallenges: number,
		playersStillPlaying: Player[],
		unusedChallenges: ChallengeData[],
		unaskedQuestions: Question[],
		language: string
	): Episode;
}

class EpisodeGenerator implements IEpisodeGenerator {
	constructor() {}

	generateCurrentEpisode(
		numChallenges: number,
		playersStillPlaying: Player[],
		unusedChallenges: ChallengeData[],
		unaskedQuestions: Question[],
		language: string
	): Episode {
		let challenges = [];
		for (let i = 0; i < numChallenges; i++) {
			let numRestrictedChallenges = ChallengeService.listChallengesForNumPlayers(
				playersStillPlaying.length,
				unusedChallenges,
				challenges
			);

			if (numRestrictedChallenges.length <= 0) {
				//TODO could cause episode to have fewer challenges than should
				continue;
			}

			numRestrictedChallenges.shuffle();
			const randomChallenge = numRestrictedChallenges[0];
			randomChallenge.initModel(playersStillPlaying, language);
			challenges.push(randomChallenge);
		}

		return new Episode(playersStillPlaying, challenges, unaskedQuestions);
	}
}

export default class Room extends StateObject {
	static MAX_CHALLENGE_QUESTIONS = 5;
	static MAX_PLAYERS = 10;
	static ROOM_STATES = {
		LOBBY: 'lobby',
		WELCOME: 'game-welcome',
		EPISODE_START: 'episode-start',
		CHALLENGE_INTERMISSION: 'challenge-intermission',
		IN_CHALLENGE: 'in-challenge',
		PRE_QUIZ_INTERMISSION: 'pre-quiz-intermission',
		IN_QUIZ: 'in-quiz',
		POST_QUIZ_INTERMISSION: 'post-quiz-intermission',
		EXECUTION: 'execution',
		EXECUTION_WRAPUP: 'execution-wrapup'
	};

	private _currentEpisode: Episode;
	private _players: Player[];

	unusedChallenges: ChallengeData[];
	isInProgress: boolean;
	points: number;
	unaskedQuestions: Question[];
	challengeStart: number;
	challengeCurrent: number;
	challengeEnd: number;
	timer: any;

	constructor(
		public roomcode: string,
		public language: string,
		private moleChooser: IMoleChooser = new MoleChooser(),
		private episodeGenerator: IEpisodeGenerator = new EpisodeGenerator()
	) {
		super(Room.ROOM_STATES.LOBBY);

		this.unaskedQuestions = questionData[language];

		this._players = [];
		this._currentEpisode = null;
		this.unusedChallenges = [];
		this.isInProgress = false;
		this.points = 0;
		this.challengeCurrent = 0;
		this.challengeStart = -1;
		this.challengeEnd = 0;
	}

	get isFull() {
		return this._players.length === Room.MAX_PLAYERS;
	}

	get playersStillPlaying() {
		return this._players.filter((p) => !p.eliminated);
	}

	get currentEpisode() {
		return this._currentEpisode;
	}

	set currentEpisode(episode) {
		this._currentEpisode = episode;
		for (let type of episode.challengeTypes) {
			this.removeUnusedChallenge(type);
		}
	}

	get numRestrictedChallenges() {
		let numPlayers = this.playersStillPlaying.length;
		return this.unusedChallenges.filter((c) => c.maxPlayers >= numPlayers && c.minPlayers <= numPlayers);
	}

	get molePlayer() {
		return this._players.find((p) => p.isMole);
	}

	get challengeDiff() {
		return this.challengeCurrent - this.challengeStart;
	}

	get state() {
		return this._state;
	}

	set state(newState: string) {
		this._state = newState;

		switch (this.state) {
			case Room.ROOM_STATES.WELCOME:
				this.isInProgress = true;
				this.chooseMole();
				break;
			case Room.ROOM_STATES.EPISODE_START:
				this.generateCurrentEpisode();
				break;
			case Room.ROOM_STATES.CHALLENGE_INTERMISSION:
				this.currentEpisode.goToNextChallenge();
				break;
			case Room.ROOM_STATES.EXECUTION:
				let executedPlayer = this.currentEpisode.eliminatedPlayer;

				for (let i = 0; i < this._players.length; i++) {
					if (executedPlayer.name === this._players[i].name) {
						this._players[i].eliminated = true;
						break;
					}
				}
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

		this._players = this._players.filter((p) => p.name !== playerName);
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

	addChallengeData(challengeData: ChallengeData[]): void {
		this.unusedChallenges = challengeData;
	}

	moveNext(): boolean {
		switch (this.state) {
			case Room.ROOM_STATES.LOBBY:
				this.state = Room.ROOM_STATES.WELCOME;
				break;
			case Room.ROOM_STATES.WELCOME:
				this.state = Room.ROOM_STATES.EPISODE_START;
				break;
			case Room.ROOM_STATES.EPISODE_START:
				this.state = Room.ROOM_STATES.IN_CHALLENGE;
				break;
			case Room.ROOM_STATES.IN_CHALLENGE:
				this.state = Room.ROOM_STATES.CHALLENGE_INTERMISSION;
				break;
			case Room.ROOM_STATES.CHALLENGE_INTERMISSION:
				if (this.currentEpisode.episodeIsOver) {
					this.state = Room.ROOM_STATES.PRE_QUIZ_INTERMISSION;
				} else {
					this.state = Room.ROOM_STATES.IN_CHALLENGE;
				}
				break;
			case Room.ROOM_STATES.PRE_QUIZ_INTERMISSION:
				this.state = Room.ROOM_STATES.IN_QUIZ;
				break;
			case Room.ROOM_STATES.IN_QUIZ:
				this.state = Room.ROOM_STATES.POST_QUIZ_INTERMISSION;
				break;
			case Room.ROOM_STATES.POST_QUIZ_INTERMISSION:
				this.state = Room.ROOM_STATES.EXECUTION;
				break;
			case Room.ROOM_STATES.EXECUTION:
				this.state = Room.ROOM_STATES.EXECUTION_WRAPUP;
				break;
			case Room.ROOM_STATES.EXECUTION_WRAPUP:
				this.state = Room.ROOM_STATES.EPISODE_START;
				break;
			default:
				return false;
		}
		return true;
	}

	generateCurrentEpisode() {
		let numChallenges = EpisodeService.getNumChallenges(this._players.length);
		this.currentEpisode = this.episodeGenerator.generateCurrentEpisode(
			numChallenges,
			this.playersStillPlaying,
			this.unusedChallenges,
			this.unaskedQuestions,
			this.language
		);
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

	getPointsForTime(
		millisecondsPerSecond: number = DATETIME.MILLISECONDS_PER_SECONDS,
		secondsPerMinute: number = DATETIME.SECONDS_PER_MINUTE
	) {
		let elapsedSeconds = this.challengeDiff / millisecondsPerSecond;
		let elapsedMinutes = Math.floor(elapsedSeconds / secondsPerMinute);
		const { pointsPerMinute } = this.currentEpisode.currentChallenge;
		return Math.floor(elapsedMinutes * pointsPerMinute);
	}

	startTimerWithCallback(
		millisecondsFromNow: number,
		millisecondsInterval: number,
		timerTickCB = () => {},
		timerDoneCB = () => {}
	) {
		this.challengeStart = Date.now();
		this.challengeCurrent = this.challengeStart;
		this.challengeEnd = this.challengeStart + millisecondsFromNow;

		clearInterval(this.timer);
		this.timer = setInterval(() => {
			this.challengeCurrent += millisecondsInterval;
			if (this.challengeCurrent >= this.challengeEnd) {
				timerDoneCB();
				clearInterval(this.timer);
			} else {
				timerTickCB();
			}
		}, millisecondsInterval);
	}
}
