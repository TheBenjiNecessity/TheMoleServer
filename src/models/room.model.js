export const ROOM_STATE = {
	LOBBY: 'lobby',
	WELCOME: 'game-welcome',
	EPISODESTART: 'episode-start'
};

export const ROOM_MAX_PLAYERS = 10;

export default class Room {
	get isFull() {
		return this.players.length === ROOM_MAX_PLAYERS;
	}

	get isInProgress() {
		return this.state !== ROOM_STATE.LOBBY;
	}

	get isStateWelcome() {
		return this.state === ROOM_STATE.WELCOME;
	}

	constructor(roomcode) {
		this.roomcode = roomcode;
		this.state = ROOM_STATE.LOBBY;
		this.players = [];
		this.episodes = [];
		this.currentEpisode = 0; //TODO make sure episodes are zero indexed
		this.currentChallenge = {};
		this.points = 0;
	}

	addPlayer(player) {
		if (this.isFull || this.isInProgress) {
			return false;
		}

		if (this.players.find((p) => p.name === player.name)) {
			return false;
		}

		this.players.push(player);
		return true;
	}

	moveNext() {
		switch (this.state) {
			case ROOM_STATE.LOBBY:
				this.state = ROOM_STATE.WELCOME;
				return true;
			case ROOM_STATE.WELCOME:
				this.state = ROOM_STATE.EPISODESTART;
				return true;
			default:
				return false;
		}
	}

	hasPlayer(playerName) {
		let roomPlayer = this.players.find((p) => p.name === playerName);
		return typeof roomPlayer !== 'undefined';
	}

	giveObjectsToPlayer(playerName, object, quantity) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].name === playerName) {
				this.players[i].setObjects(object, quantity);
				break;
			}
		}
	}

	removeObjectsFromPlayer(playerName, object, quantity) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].name === playerName) {
				this.players[i].removeObjects(object, quantity);
				break;
			}
		}
	}

	addPoints(points = 1) {
		this.points += points;
	}

	removePoints(points = 1) {
		this.points -= points;

		if (this.points < 0) {
			this.points = 0;
		}
	}
}
