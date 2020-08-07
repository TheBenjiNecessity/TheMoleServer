import RaisedHand from '../raisedHand.model';

export default class Challenge {
	constructor(title, type, description, maxPlayers, minPlayers, questions, state = 'roles') {
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
		}
	}

	performEvent(event, { player, role }) {
		switch (event) {
			case 'add-agreed-player':
				this.addAgreedPlayer(player);
				break;
			case 'raise-hand-for-player':
				this.raiseHandForPlayer(player, role);
				break;
			case 'set-voted-player':
				this.setVotedPlayer(player);
				break;
			case 'remove-voted-player':
				this.removeVotedPlayer(player);
				break;
			default:
				break;
		}
	}
}
