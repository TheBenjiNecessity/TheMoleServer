const roomstate = {
	LOBBY: 'lobby',
	WELCOME: 'game-welcome',
	EPISODESTART: 'episode-start'
};

export class Room {
	get isFull() {
		return this.players.length === 10;
	}

	get isInProgress() {
		return this.state !== roomstate.LOBBY;
	}

	get isStateWelcome() {
		return this.state === roomstate.WELCOME;
	}

	constructor(roomcode) {
		this.roomcode = roomcode;
		this.state = roomstate.LOBBY;
		this.players = [];
		this.episodes = [];
		this.currentEpisode = 0; //TODO make sure episodes are zero indexed
		this.currentChallenge = {};

		this.agreedPlayers = [];
		this.raisedHands = {};
	}

	addPlayer(player) {
		this.players.push(player);
	}

	moveNext() {
		switch (this.state) {
			case roomstate.LOBBY:
				this.state = roomstate.WELCOME;
				return true;
			case roomstate.WELCOME:
				this.state = roomstate.EPISODESTART;
				return true;
			default:
				return false;
		}
	}

	hasPlayer(player) {
		let roomPlayer = this.players.find((p) => p.name === player.name);
		return typeof roomPlayer !== 'undefined';
	}

	giveObjectsToPlayer(player, object, quantity) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].name === player.name) {
				this.players[i].setObjects(object, quantity);
				break;
			}
		}
	}

	removeObjectsFromPlayer(player, object, quantity) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].name === player.name) {
				this.players[i].removeObjects(object, quantity);
				break;
			}
		}
	}
}
