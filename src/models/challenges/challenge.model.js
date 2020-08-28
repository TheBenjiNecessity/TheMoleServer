import RaisedHand from '../raisedHand.model';
import Role from '../role.model';
import { ROOM_MAX_PLAYERS } from '../room.model';
import challengeData from './challenge.data';

export const CHALLENGE_EVENTS = {
	ADD_AGREED_PLAYER: 'addAgreedPlayer',
	RAISE_HAND_FOR_PLAYER: 'raiseHandForPlayer',
	SET_VOTED_PLAYER: 'setVotedPlayer',
	REMOVE_VOTED_PLAYER: 'removeVotedPlayer'
};

export const CHALLENGE_STATES = {
	ROLE_SELECTION: 'role-selection',
	IN_GAME: 'game'
};

export default class Challenge {
	constructor(episode, type = '') {
		let { title, description, maxPlayers, minPlayers, questions, initialState, roles } = challengeData.find(
			(c) => c.type === type
		);

		if (
			maxPlayers > ROOM_MAX_PLAYERS ||
			minPlayers > ROOM_MAX_PLAYERS ||
			maxPlayers < 1 ||
			minPlayers < 1 ||
			maxPlayers < minPlayers
		) {
			throw 'Min/Max players out of acceptable range';
		}

		this.currentEpisode = episode;
		this.title = title;
		this.type = type;
		this.description = description;
		this.maxPlayers = maxPlayers;
		this.minPlayers = minPlayers;
		this.roles = roles.map((r) => new Role(r.name, r.numPlayers));
		this.questions = questions.map((qd) => new Question(qd.text, qd.type, qd.choices));
		this.state = initialState;
		this.agreedPlayers = [];
		this.raisedHands = [];
		this.votedPlayers = {};
	}

	get hasMajorityVoteForAgreedPlayers() {
		return this.agreedPlayers.length >= this.currentEpisode.players.length / 2;
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
				this.setRoles();
				this.state = CHALLENGE_STATES.IN_GAME;
				break;
			default:
				break;
		}
	}
}
