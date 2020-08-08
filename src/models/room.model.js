import Player from '../models/player.model';

export default class Room {
	get isFull() {
		return this.players.length === Room.MAX_PLAYERS;
	}

	get isInProgress() {
		return this.state !== Room.ROOM_STATE.LOBBY;
	}

	get isStateWelcome() {
		return this.state === Room.ROOM_STATE.WELCOME;
	}

	static get MAX_PLAYERS() {
		return 10;
	}

	static get ROOM_STATE() {
		return {
			LOBBY: 'lobby',
			WELCOME: 'game-welcome',
			EPISODESTART: 'episode-start'
		};
	}

	constructor(roomcode) {
		this.roomcode = roomcode;
		this.state = Room.ROOM_STATE.LOBBY;
		this.players = [];
		this.episodes = [];
		this.currentEpisode = 0; //TODO make sure episodes are zero indexed
		this.currentChallenge = {};
		this.points = 0;
	}

	addPlayer(player) {
		if (this.isFull) {
			return false;
		}

		this.players.push(player);
		return true;
	}

	moveNext() {
		switch (this.state) {
			case Room.ROOM_STATE.LOBBY:
				this.state = Room.ROOM_STATE.WELCOME;
				return true;
			case Room.ROOM_STATE.WELCOME:
				this.state = Room.ROOM_STATE.EPISODESTART;
				return true;
			default:
				return false;
		}
	}

	hasPlayer(player) {
		let roomPlayer = this.players.find((p) => p.name === player.name);
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
	}

	static getTestRoomWithTenPlayers() {
		let room = new Room('TEST');

		room.addPlayer(new Player('test1'));
		room.addPlayer(new Player('test2'));
		room.addPlayer(new Player('test3'));
		room.addPlayer(new Player('test4'));
		room.addPlayer(new Player('test5'));
		room.addPlayer(new Player('test6'));
		room.addPlayer(new Player('test7'));
		room.addPlayer(new Player('test8'));
		room.addPlayer(new Player('test9'));
		room.addPlayer(new Player('test0'));

		return room;
	}

	static getTestRoomWithFivePlayers() {
		let room = new Room('TEST');

		room.addPlayer(new Player('test1'));
		room.addPlayer(new Player('test2'));
		room.addPlayer(new Player('test3'));
		room.addPlayer(new Player('test4'));
		room.addPlayer(new Player('test5'));

		return room;
	}

	static getTestRoomWithNoPlayers() {
		return new Room('TEST');
	}
}
