export class Room {
	get isFull() {
		return this.players.length === 10;
	}

	get isInProgress() {
		return this.state !== 'lobby';
	}

	constructor(roomCode) {
		this.roomCode = roomCode;
		this.state = 'lobby';
		this.players = [];
		this.episodes = [];
	}

	addPlayer(player) {
		this.players.push(player);
	}

	startGame() {
		if (this.state !== 'lobby') return false;

		this.state = 'game-welcome';
		return true;
	}

	startWelcome() {
		if (this.state !== 'game-welcome') return false;

		this.state = 'episode-start';
		return true;
	}

	hasPlayer(player) {
		let roomPlayer = this.players.find((p) => p.name === player.name);
		return typeof roomPlayer !== 'undefined';
	}
}
