import Room from './room.model';
import { PlayerCreator } from '../models/player.model';

test('Tests room init', () => {
	let room = new Room('TEST');
	expect(room.players.length).toBe(0);
	expect(room.isFull).toBe(false);
	expect(room.isInProgress).toBe(false);
	expect(room.roomcode).toBe('TEST');
	expect(room.state).toBe('lobby');
});

test('Tests empty room', () => {
	let room = Room.getTestRoomWithNoPlayers();
	expect(room.players.length).toBe(0);
	expect(room.isFull).toBe(false);
	expect(room.isInProgress).toBe(false);
});

test('Tests partially full room', () => {
	let room = Room.getTestRoomWithFivePlayers();
	expect(room.players.length).toBe(5);
	expect(room.players[0].name).toBe('test1');
	expect(room.players[1].name).toBe('test2');
	expect(room.players[2].name).toBe('test3');
	expect(room.players[3].name).toBe('test4');
	expect(room.players[4].name).toBe('test5');
	expect(room.isFull).toBe(false);
	expect(room.isInProgress).toBe(false);
});

test('Tests full room', () => {
	let room = Room.getTestRoomWithTenPlayers();
	expect(room.players.length).toBe(10);
	expect(room.players[0].name).toBe('test1');
	expect(room.players[1].name).toBe('test2');
	expect(room.players[2].name).toBe('test3');
	expect(room.players[3].name).toBe('test4');
	expect(room.players[4].name).toBe('test5');
	expect(room.players[5].name).toBe('test6');
	expect(room.players[6].name).toBe('test7');
	expect(room.players[7].name).toBe('test8');
	expect(room.players[8].name).toBe('test9');
	expect(room.players[9].name).toBe('test0');
	expect(room.isFull).toBe(true);
	expect(room.isInProgress).toBe(false);
});

test('Tests adding player to empty room', () => {
	let room = Room.getTestRoomWithNoPlayers();
	let newTestPlayer = PlayerCreator.createPlayer({ name: 'test11' }).player;

	expect(room.addPlayer(newTestPlayer)).toBe(true);
	expect(room.players.length).toBe(1);
	expect(room.players[room.players.length - 1].name).toBe('test11');
});

test('Tests adding player to partially full room', () => {
	let room = Room.getTestRoomWithFivePlayers();
	let newTestPlayer = PlayerCreator.createPlayer({ name: 'test11' }).player;
	expect(room.addPlayer(newTestPlayer)).toBe(true);
	expect(room.players.length).toBe(6);
	expect(room.players[room.players.length - 1].name).toBe('test11');
});

test('Tests adding player to full room', () => {
	let room = Room.getTestRoomWithTenPlayers();
	let newTestPlayer = PlayerCreator.createPlayer({ name: 'test11' }).player;
	expect(room.addPlayer(newTestPlayer)).toBe(false);
	expect(room.players.length).toBe(10);
});

test('Tests "hasPlayer" method', () => {
	let room = Room.getTestRoomWithNoPlayers();
	let newTestPlayer = PlayerCreator.createPlayer({ name: 'test11' }).player;

	expect(room.hasPlayer(newTestPlayer)).toBe(false);

	room.addPlayer(newTestPlayer);

	expect(room.hasPlayer(newTestPlayer)).toBe(true);
});

test('Tests giveObjectsToPlayer (exemption)', () => {
	let objectName = 'exemption';
	let room = Room.getTestRoomWithFivePlayers();

	room.giveObjectsToPlayer(room.players[0].name, objectName);
	room.giveObjectsToPlayer(room.players[1].name, objectName, 1);
	room.giveObjectsToPlayer(room.players[2].name, objectName, 2);

	expect(room.players[0].objects[objectName]).toBe(1);
	expect(room.players[1].objects[objectName]).toBe(1);
	expect(room.players[2].objects[objectName]).toBe(2);
});

test('Tests giveObjectsToPlayer (joker)', () => {
	let objectName = 'joker';
	let room = Room.getTestRoomWithFivePlayers();

	room.giveObjectsToPlayer(room.players[0].name, objectName);
	room.giveObjectsToPlayer(room.players[1].name, objectName, 1);
	room.giveObjectsToPlayer(room.players[2].name, objectName, 2);

	expect(room.players[0].objects[objectName]).toBe(1);
	expect(room.players[1].objects[objectName]).toBe(1);
	expect(room.players[2].objects[objectName]).toBe(2);
});

test('Tests giveObjectsToPlayer (black exemption)', () => {
	let objectName = 'black-exemption';
	let room = Room.getTestRoomWithFivePlayers();

	room.giveObjectsToPlayer(room.players[0].name, objectName);
	room.giveObjectsToPlayer(room.players[1].name, objectName, 1);
	room.giveObjectsToPlayer(room.players[2].name, objectName, 2);

	expect(room.players[0].objects[objectName]).toBe(1);
	expect(room.players[1].objects[objectName]).toBe(1);
	expect(room.players[2].objects[objectName]).toBe(2);
});

test('Tests removeObjectsFromPlayer (exemption)', () => {
	let objectName = 'exemption';
	let room = Room.getTestRoomWithFivePlayers();

	room.giveObjectsToPlayer(room.players[0].name, objectName);
	room.giveObjectsToPlayer(room.players[1].name, objectName, 1);
	room.giveObjectsToPlayer(room.players[2].name, objectName, 2);

	room.removeObjectsFromPlayer(room.players[0].name, objectName);
	room.removeObjectsFromPlayer(room.players[1].name, objectName, 1);
	room.removeObjectsFromPlayer(room.players[2].name, objectName, 2);

	expect(room.players[0].objects[objectName]).toBe(0);
	expect(room.players[1].objects[objectName]).toBe(0);
	expect(room.players[2].objects[objectName]).toBe(0);
});

test('Tests removeObjectsFromPlayer (joker)', () => {
	let objectName = 'joker';
	let room = Room.getTestRoomWithFivePlayers();

	room.giveObjectsToPlayer(room.players[0].name, objectName);
	room.giveObjectsToPlayer(room.players[1].name, objectName, 1);
	room.giveObjectsToPlayer(room.players[2].name, objectName, 2);

	room.removeObjectsFromPlayer(room.players[0].name, objectName);
	room.removeObjectsFromPlayer(room.players[1].name, objectName, 1);
	room.removeObjectsFromPlayer(room.players[2].name, objectName, 2);

	expect(room.players[0].objects[objectName]).toBe(0);
	expect(room.players[1].objects[objectName]).toBe(0);
	expect(room.players[2].objects[objectName]).toBe(0);
});

test('Tests removeObjectsFromPlayer (black-exemption)', () => {
	let objectName = 'black-exemption';
	let room = Room.getTestRoomWithFivePlayers();

	room.giveObjectsToPlayer(room.players[0].name, objectName);
	room.giveObjectsToPlayer(room.players[1].name, objectName, 1);
	room.giveObjectsToPlayer(room.players[2].name, objectName, 2);

	room.removeObjectsFromPlayer(room.players[0].name, objectName);
	room.removeObjectsFromPlayer(room.players[1].name, objectName, 1);
	room.removeObjectsFromPlayer(room.players[2].name, objectName, 2);

	expect(room.players[0].objects[objectName]).toBe(0);
	expect(room.players[1].objects[objectName]).toBe(0);
	expect(room.players[2].objects[objectName]).toBe(0);
});

test('Tests moveNext', () => {
	let room = Room.getTestRoomWithFivePlayers();
	expect(room.state).toBe('lobby');
	expect(room.moveNext()).toBe(true);
	expect(room.state).toBe('game-welcome');
	expect(room.moveNext()).toBe(true);
	expect(room.state).toBe('episode-start');
});

test('Tests initCurrentChallenge', () => {
	let room = Room.getTestRoomWithFivePlayers();
	room.initCurrentChallenge('platter');
	expect(room.currentChallenge.constructor.name).toBe('PlatterChallenge');
	room.initCurrentChallenge('path');
	expect(room.currentChallenge.constructor.name).toBe('PathChallenge');
});
