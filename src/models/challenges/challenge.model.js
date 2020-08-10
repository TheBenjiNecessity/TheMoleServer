import RaisedHand from '../raisedHand.model';
import Room, { ROOM_MAX_PLAYERS } from '../room.model';

export const CHALLENGE_EVENTS = {
	ADD_AGREED_PLAYER: 'add-agreed-player',
	RAISE_HAND_FOR_PLAYER: 'raise-hand-for-player',
	SET_VOTED_PLAYER: 'set-voted-player',
	REMOVE_VOTED_PLAYER: 'remove-voted-player'
};

export default class Challenge {
	constructor(room, title, type, description, maxPlayers, minPlayers, questions, state = 'roles') {
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
		this.questions = questions;
		this.state = state;
		this.agreedPlayers = [];
		this.raisedHands = [];
		this.votedPlayers = {};
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

	performEvent(event, { player, role }) {
		switch (event) {
			case CHALLENGE_EVENTS.ADD_AGREED_PLAYER:
				this.addAgreedPlayer(player);
				break;
			case CHALLENGE_EVENTS.RAISE_HAND_FOR_PLAYER:
				this.raiseHandForPlayer(player, role);
				break;
			case CHALLENGE_EVENTS.SET_VOTED_PLAYER:
				this.setVotedPlayer(player);
				break;
			case CHALLENGE_EVENTS.REMOVE_VOTED_PLAYER:
				this.removeVotedPlayer(player);
				break;
			default:
				break;
		}
	}
}
