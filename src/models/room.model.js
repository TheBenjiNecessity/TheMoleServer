import PlatterChallenge from './challenges/platter.challenge';
import PathChallenge from './challenges/path.challenge';
import Player from '../models/player.model';

const MAX_PLAYERS = 10;
const roomstate = {
	LOBBY: 'lobby',
	WELCOME: 'game-welcome',
	EPISODESTART: 'episode-start'
};

export default class Room {
	get isFull() {
		return this.players.length === MAX_PLAYERS;
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

	initCurrentChallenge(type) {
		switch (type) {
			case 'platter':
				this.currentChallenge = new PlatterChallenge(this.players);
				break;
			case 'path':
				this.currentChallenge = new PathChallenge(this.players);
				break;
			default:
				return null;
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
