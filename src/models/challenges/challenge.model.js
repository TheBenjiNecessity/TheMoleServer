import RaisedHand from '../raisedHand.model';
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
	constructor(room, type = '') {
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

		this.room = room;
		this.title = title;
		this.type = type;
		this.description = description;
		this.maxPlayers = maxPlayers;
		this.minPlayers = minPlayers;
		this.roles = roles;
		this.questions = questions.map((qd) => new Question(qd.text, qd.type, qd.choices));
		this.state = initialState;
		this.agreedPlayers = [];
		this.raisedHands = [];
		this.votedPlayers = {};
	}

	get hasMajorityVoteForAgreedPlayers() {
		return this.agreedPlayers.length >= this.room.players.filter((p) => !p.eliminated).length / 2;
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

	moveNext() {
		switch (this.state) {
			case CHALLENGE_STATES.ROLE_SELECTION:
				this.state = CHALLENGE_STATES.IN_GAME;
				break;
			default:
				break;
		}
	}
}
