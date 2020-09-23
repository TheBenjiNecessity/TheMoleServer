import RaisedHand from './raisedHand.model';
import Role from './role.model';
import Question from './quiz/question.model';

import { ROOM_MAX_PLAYERS } from '../contants/room.constants';
import { CHALLENGE_STATES } from '../contants/challenge.constants';

export default class Challenge {
	constructor(players, title, description, maxPlayers, minPlayers, questions, initialState, roles, type) {
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
		this.roles = roles && roles.length ? roles.map((r) => new Role(r.name, r.numPlayers)) : [];
		this.questions =
			questions && questions.length ? questions.map((qd) => new Question(qd.text, qd.type, qd.choices)) : [];
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
			let raisedHandsOfRole = this.raisedHands.filter((rh) => rh.role === role.name);
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
			this.raisedHands.push(new RaisedHand(player, role));
		}

		this.agreedPlayers = [];
	}

	setVotedPlayer(player) {
		if (!this.votedPlayers[player.name]) {
			this.votedPlayers[player.name] = 1;
		} else {
			this.votedPlayers[player.name]++;
		}
	}

	removeVotedPlayer(player) {
		if (this.votedPlayers[player.name]) {
			this.votedPlayers[player.name]--;

			if (this.votedPlayers[player.name] <= 0) {
				delete this.votedPlayers[player.name];
			}
		}
	}

	setRoles() {
		if (!this.raisedHandsAreValid) {
			return;
		}

		for (let i = 0; i < this.players.length; i++) {
			this.players[i].currentRole = null;
			let raisedHand = this.raiseHands.find((rh) => rh.player.name === this.players[i].name);
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

	startTimerWithCallback({ roomcode, duringCB, endCB, minutes }) {
		this.challengeStart = Date.now;
		this.challengeEnd = Date.minutesFromNow(minutes);
		this.isChallengeRunning = true;
		this.timer = setInterval(() => {
			if (Date.now > this.challengeEnd) {
				endCB(roomcode);
				this.endChallenge();
			} else {
				duringCB(roomcode);
			}
		}, 1000);
	}

	endChallenge() {
		clearInterval(this.timer);
		this.isChallengeRunning = false;
		this.moveNext();
	}
}
