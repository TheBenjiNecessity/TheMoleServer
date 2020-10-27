import Player from '../models/player.model';
import Room from '../models/room.model';
import RoomSampleService from '../models/samples/room.sample';

test('Tests room init', () => {
	let room = new Room('TEST', 'en');
	expect(room.players.length).toBe(0);
	expect(room.isFull).toBe(false);
	expect(room.isInProgress).toBe(false);
	expect(room.roomcode).toBe('TEST');
	expect(room.state).toBe('lobby');
});

test('Tests empty room', () => {
	let room = RoomSampleService.getTestRoomWithNoPlayers();
	expect(room.players.length).toBe(0);
	expect(room.isFull).toBe(false);
	expect(room.isInProgress).toBe(false);
});

test('Tests partially full room', () => {
	let room = RoomSampleService.getTestRoomWithFivePlayers();
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
	let room = RoomSampleService.getTestRoomWithTenPlayers();
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
	let room = RoomSampleService.getTestRoomWithNoPlayers();
	let newTestPlayer = new Player('test11');

	expect(room.addPlayer(newTestPlayer)).toBe(true);
	expect(room.players.length).toBe(1);
	expect(room.players[room.players.length - 1].name).toBe('test11');
});

test('Tests adding player to partially full room', () => {
	let room = RoomSampleService.getTestRoomWithFivePlayers();
	let newTestPlayer = new Player('test11');
	expect(room.addPlayer(newTestPlayer)).toBe(true);
	expect(room.players.length).toBe(6);
	expect(room.players[room.players.length - 1].name).toBe('test11');
});

test('Tests adding player to full room', () => {
	let room = RoomSampleService.getTestRoomWithTenPlayers();
	let newTestPlayer = new Player('test11');
	expect(room.addPlayer(newTestPlayer)).toBe(false);
	expect(room.players.length).toBe(10);
});

test('Tests adding player to room in progress', () => {
	let room = RoomSampleService.getTestRoomWithFivePlayers();
	let newTestPlayer = new Player('test11');
	room.isInProgress = true;
	expect(room.addPlayer(newTestPlayer)).toBe(false);
	expect(room.players.length).toBe(5);
});

test('Tests "hasPlayer" method', () => {
	let room = RoomSampleService.getTestRoomWithNoPlayers();
	let newTestPlayer = new Player('test11');

	expect(room.hasPlayer(newTestPlayer.name)).toBe(false);

	room.addPlayer(newTestPlayer);

	expect(room.hasPlayer(newTestPlayer.name)).toBe(true);
});

test('Tests giveObjectsToPlayer (exemption)', () => {
	let objectName = 'exemption';
	let room = RoomSampleService.getTestRoomWithFivePlayers();

	room.giveObjectsToPlayer(room.players[0].name, objectName);
	room.giveObjectsToPlayer(room.players[1].name, objectName, 1);
	room.giveObjectsToPlayer(room.players[2].name, objectName, 2);

	expect(room.players[0].objects[objectName]).toBe(1);
	expect(room.players[1].objects[objectName]).toBe(1);
	expect(room.players[2].objects[objectName]).toBe(2);
});

test('Tests giveObjectsToPlayer (joker)', () => {
	let objectName = 'joker';
	let room = RoomSampleService.getTestRoomWithFivePlayers();

	room.giveObjectsToPlayer(room.players[0].name, objectName);
	room.giveObjectsToPlayer(room.players[1].name, objectName, 1);
	room.giveObjectsToPlayer(room.players[2].name, objectName, 2);

	expect(room.players[0].objects[objectName]).toBe(1);
	expect(room.players[1].objects[objectName]).toBe(1);
	expect(room.players[2].objects[objectName]).toBe(2);
});

test('Tests giveObjectsToPlayer (black exemption)', () => {
	let objectName = 'black-exemption';
	let room = RoomSampleService.getTestRoomWithFivePlayers();

	room.giveObjectsToPlayer(room.players[0].name, objectName);
	room.giveObjectsToPlayer(room.players[1].name, objectName, 1);
	room.giveObjectsToPlayer(room.players[2].name, objectName, 2);

	expect(room.players[0].objects[objectName]).toBe(1);
	expect(room.players[1].objects[objectName]).toBe(1);
	expect(room.players[2].objects[objectName]).toBe(2);
});

test('Tests removeObjectsFromPlayer (exemption)', () => {
	let objectName = 'exemption';
	let room = RoomSampleService.getTestRoomWithFivePlayers();

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
	let room = RoomSampleService.getTestRoomWithFivePlayers();

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
	let room = RoomSampleService.getTestRoomWithFivePlayers();

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
	let room = RoomSampleService.getTestRoomWithFivePlayers();
	expect(room.state).toBe('lobby');
	room.moveNext();
	expect(room.state).toBe('game-welcome');
	room.moveNext();
	expect(room.state).toBe('episode-start');
});
