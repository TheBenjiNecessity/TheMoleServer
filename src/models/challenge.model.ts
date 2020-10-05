import RaisedHand from './raisedHand.model';
import Role from './role.model';
import Question from './quiz/question.model';

import { ROOM_MAX_PLAYERS } from '../contants/room.constants';
import { CHALLENGE_STATES } from '../contants/challenge.constants';
import Player from './player.model';

import '../extensions/date';

export default class Challenge {
	private _state: string;

	players: Player[];
	title: string;
	type: string;
	description: string;
	maxPlayers: number;
	minPlayers: number;
	roles: Role[];
	questions: Question[];

	agreedPlayers: Player[];
	raisedHands: RaisedHand[];
	votedPlayers: any;
	challengeStart: number;
	challengeEnd: number;
	isChallengeRunning: boolean;
	timer: any;

	constructor(
		players: Player[],
		title: string,
		description: string,
		maxPlayers: number,
		minPlayers: number,
		questions: Question[],
		initialState: string,
		roles: Role[],
		type: string
	) {
		if (
			maxPlayers > ROOM_MAX_PLAYERS ||
			minPlayers > ROOM_MAX_PLAYERS ||
			maxPlayers < 1 ||
			minPlayers < 1 ||
			maxPlayers < minPlayers
		) {
			throw 'Min/Max players out of acceptable range';
		}

		this.players = players;
		this.title = title;
		this.type = type;
		this.description = description;
		this.maxPlayers = maxPlayers;
		this.minPlayers = minPlayers;
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
			default:
				break;
		}
	}

	canSupportNumPlayers(numPlayers) {
		return numPlayers >= this.minPlayers && numPlayers <= this.maxPlayers;
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

	startTimerWithCallback(roomcode, duringCB, endCB, millisecondsFromNow, millisecondsInterval) {
		this.challengeStart = Date.now();
		this.challengeEnd = Date.millisecondsFromNow(millisecondsFromNow);
		this.isChallengeRunning = true;
		this.timer = setInterval(() => {
			if (Date.now() >= this.challengeEnd) {
				endCB(roomcode);
				this.endChallenge();
			} else {
				duringCB(roomcode);
			}
		}, millisecondsInterval);
	}

	endChallenge() {
		clearInterval(this.timer);
		this.isChallengeRunning = false;
		this.moveNext();
	}
}
