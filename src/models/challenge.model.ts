import RaisedHand from './raisedHand.model';
import Role from './role.model';
import Question from './quiz/question.model';

import { ROOM_MAX_PLAYERS } from '../contants/room.constants';
import { CHALLENGE_STATES } from '../contants/challenge.constants';
import Player from './player.model';

import '../extensions/date';

export default abstract class Challenge {
	private _state: string;

	players: Player[];
	title: string;
	type: string;
	description: string;
	roles: Role[];
	questions: Question[];

	agreedPlayers: Player[];
	raisedHands: RaisedHand[];
	votedPlayers: any;
	challengeStart: number;
	challengeCurrent: number;
	challengeEnd: number;
	isChallengeRunning: boolean;
	timer: any;
	currentTime: number;

	constructor(
		players: Player[],
		title: string,
		description: string,
		questions: Question[],
		initialState: string,
		roles: Role[],
		type: string
	) {
		this.players = players;
		this.title = title;
		this.type = type;
		this.description = description;
		this.roles = roles;
		this.questions = questions;
		this._state = initialState;
		this.agreedPlayers = [];
		this.raisedHands = [];
		this.votedPlayers = {};
		this.challengeStart = -1;
		this.challengeEnd = -1;
		this.isChallengeRunning = false;
		this.timer = null;
		this.challengeCurrent = 0;
	}

	get hasMajorityVoteForAgreedPlayers() {
		return this.agreedPlayers.length >= this.players.length / 2;
	}

	get raisedHandsAreValid() {
		for (let role of this.roles) {
			let raisedHandsOfRole = this.raisedHands.filter((rh) => rh.role.name === role.name);
			if (raisedHandsOfRole.length !== role.numPlayers) {
				return false;
			}
		}
		return true;
	}

	get state() {
		return this._state;
	}

	set state(newState) {
		this._state = newState;

		switch (this.state) {
			case CHALLENGE_STATES.IN_GAME:
				this.setRoles();
				break;
			case CHALLENGE_STATES.CHALLENGE_END:
				clearInterval(this.timer);
				this.isChallengeRunning = false;
				break;
			default:
				break;
		}
	}

	get challengeDiff() {
		return this.challengeCurrent - this.challengeStart;
	}

	addAgreedPlayer(player) {
		let foundPlayer = this.agreedPlayers.find((p) => p.name === player.name);
		if (!foundPlayer) {
			this.agreedPlayers.push(player);
		}
	}

	raiseHandForPlayer(player, role) {
		let foundRaisedHand = this.raisedHands.find((r) => r.player.name === player.name);

		if (foundRaisedHand) {
			let indexOfRaisedHand = this.raisedHands.indexOf(foundRaisedHand);
			this.raisedHands[indexOfRaisedHand].role = role;
		} else {
			this.raisedHands.push({ player, role });
		}

		this.agreedPlayers = [];
	}

	setVotedPlayer(playerName: string) {
		if (!this.votedPlayers[playerName]) {
			this.votedPlayers[playerName] = 1;
		} else {
			this.votedPlayers[playerName]++;
		}
	}

	removeVotedPlayer(playerName: string) {
		if (this.votedPlayers[playerName]) {
			this.votedPlayers[playerName]--;

			if (this.votedPlayers[playerName] <= 0) {
				delete this.votedPlayers[playerName];
			}
		}
	}

	setRoles() {
		if (!this.raisedHandsAreValid) {
			return;
		}

		for (let i = 0; i < this.players.length; i++) {
			this.players[i].currentRole = null;
			let raisedHand = this.raisedHands.find((rh) => rh.player.name === this.players[i].name);
			if (raisedHand) {
				this.players[i].currentRole = raisedHand.role;
			}
		}
	}

	moveNext() {
		switch (this.state) {
			case CHALLENGE_STATES.ROLE_SELECTION:
				this.state = CHALLENGE_STATES.IN_GAME;
				break;
			case CHALLENGE_STATES.IN_GAME:
				this.state = CHALLENGE_STATES.CHALLENGE_END;
				break;
			default:
				break;
		}
	}

	startTimerWithCallback(
		roomcode: string,
		duringCB: Function,
		endCB: Function,
		millisecondsFromNow: number,
		millisecondsInterval: number
	) {
		this.challengeStart = Date.now();
		this.challengeCurrent = this.challengeStart;
		this.challengeEnd = this.challengeStart + millisecondsFromNow;

		this.isChallengeRunning = true;
		this.timer = setInterval(() => {
			this.challengeCurrent += millisecondsInterval;
			if (this.challengeCurrent >= this.challengeEnd) {
				endCB(roomcode);
				this.endChallenge();
			} else {
				duringCB(roomcode);
			}
		}, millisecondsInterval);
	}

	endChallenge() {
		this.state = CHALLENGE_STATES.CHALLENGE_END;
	}
}
