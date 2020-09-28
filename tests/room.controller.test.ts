import { ROOM_STATE } from '../src/contants/room.constants';
import RoomController from '../src/controllers/room.controller';
import Player from '../src/models/player.model';
import Room from '../src/models/room.model';
import RoomService from '../src/services/room/room.service';
import RoomSampleService from './room.sample';

const ROOMCODE_REGEX = /[A-Z]{4}/;

test('Checks "roomCodeAlreadyExists" method', () => {
	let room = RoomSampleService.getTestRoomWithTenPlayers();
	RoomController.getInstance().setRoom(room);

	expect(RoomController.getInstance().roomCodeAlreadyExists(room.roomcode)).toBe(true);
	expect(RoomController.getInstance().roomCodeAlreadyExists('NOOP')).toBe(false);
});

test('Checks "generateRandomRoomCodeNotUsed" method', () => {
	let room = RoomSampleService.getTestRoomWithTenPlayers(); // Gets room with roomcode 'TEST'
	RoomController.getInstance().setRoom(room);

	let roomcode = RoomController.getInstance().generateRandomRoomCodeNotUsed();

	expect(ROOMCODE_REGEX.test(roomcode)).toBe(true);
	expect(RoomService.roomCodeIsABadWord(roomcode)).toBe(false);
	expect(roomcode !== 'TEST').toBe(true);
	expect(typeof RoomController.getInstance().getRoom(roomcode)).toBe('undefined');
});

test('Checks "addRoom" method', () => {
	let roomcode = 'TEST';
	let room = new Room(roomcode);
	RoomController.getInstance().setRoom(room);
	expect(typeof RoomController.getInstance().rooms[roomcode]).toBe('object');
	expect(RoomController.getInstance().rooms[roomcode].roomcode).toBe(roomcode);
});

test('Checks getRoom/setRoom methods', () => {
	let room = RoomSampleService.getTestRoomWithTenPlayers(); // Gets room with roomcode 'TEST'
	let { roomcode } = room;
	RoomController.getInstance().setRoom(room);

	expect(typeof RoomController.getInstance().rooms[roomcode]).toBe('object');
	expect(RoomController.getInstance().rooms[roomcode].roomcode).toBe(roomcode);
	expect(typeof RoomController.getInstance().getRoom('TEST')).toBe('object');
	expect(RoomController.getInstance().getRoom('TEST').roomcode).toBe('TEST');
});

test('Checks "addPlayerToRoom" method', () => {
	let room = RoomSampleService.getTestRoomWithNoPlayers(); // Gets room with roomcode 'TEST'
	RoomController.getInstance().setRoom(room);

	RoomController.getInstance().addPlayerToRoom('TEST', new Player('test11'));

	expect(RoomController.getInstance().getRoom('TEST').players.length).toBe(1);
	expect(RoomController.getInstance().getRoom('TEST').players[0].name).toBe('test11');

	RoomController.getInstance().addPlayerToRoom('TEST', new Player('test11'));

	expect(RoomController.getInstance().getRoom('TEST').players.length).toBe(1);
	expect(RoomController.getInstance().getRoom('TEST').players[0].name).toBe('test11');

	RoomController.getInstance().addPlayerToRoom('TEST', new Player('test12'));

	expect(RoomController.getInstance().getRoom('TEST').players.length).toBe(2);
	expect(RoomController.getInstance().getRoom('TEST').players[1].name).toBe('test12');
});

test('Checks "removePlayerToRoom" method', () => {}); //TODO

test('Checks "giveObjectsToPlayer/removeObjectsFromPlayer" methods', () => {
	let room = RoomSampleService.getTestRoomWithTenPlayers(); // Gets room with roomcode 'TEST'
	let { roomcode } = room;
	let exemption = 'exemption';
	let joker = 'joker';
	let blackExemption = 'black-exemption';
	RoomController.getInstance().setRoom(room);

	let player = room.players[0];

	RoomController.getInstance().giveObjectsToPlayer(roomcode, player.name, exemption, 2);
	expect(RoomController.getInstance().getRoom(roomcode).players[0].objects[exemption]).toBe(2);
	expect(RoomController.getInstance().getRoom(roomcode).players[0].objects[joker]).toBe(0);
	expect(RoomController.getInstance().getRoom(roomcode).players[0].objects[blackExemption]).toBe(0);

	RoomController.getInstance().giveObjectsToPlayer(roomcode, player.name, joker, 2);
	expect(RoomController.getInstance().getRoom(roomcode).players[0].objects[exemption]).toBe(2);
	expect(RoomController.getInstance().getRoom(roomcode).players[0].objects[joker]).toBe(2);
	expect(RoomController.getInstance().getRoom(roomcode).players[0].objects[blackExemption]).toBe(0);

	RoomController.getInstance().giveObjectsToPlayer(roomcode, player.name, blackExemption, 2);
	expect(RoomController.getInstance().getRoom(roomcode).players[0].objects[exemption]).toBe(2);
	expect(RoomController.getInstance().getRoom(roomcode).players[0].objects[joker]).toBe(2);
	expect(RoomController.getInstance().getRoom(roomcode).players[0].objects[blackExemption]).toBe(2);

	RoomController.getInstance().removeObjectsFromPlayer(roomcode, player.name, exemption, 1);
	expect(RoomController.getInstance().getRoom(roomcode).players[0].objects[exemption]).toBe(1);
	expect(RoomController.getInstance().getRoom(roomcode).players[0].objects[joker]).toBe(2);
	expect(RoomController.getInstance().getRoom(roomcode).players[0].objects[blackExemption]).toBe(2);

	RoomController.getInstance().removeObjectsFromPlayer(roomcode, player.name, joker, 2);
	expect(RoomController.getInstance().getRoom(roomcode).players[0].objects[exemption]).toBe(1);
	expect(RoomController.getInstance().getRoom(roomcode).players[0].objects[joker]).toBe(0);
	expect(RoomController.getInstance().getRoom(roomcode).players[0].objects[blackExemption]).toBe(2);

	RoomController.getInstance().removeObjectsFromPlayer(roomcode, player.name, blackExemption, 3);
	expect(RoomController.getInstance().getRoom(roomcode).players[0].objects[exemption]).toBe(1);
	expect(RoomController.getInstance().getRoom(roomcode).players[0].objects[joker]).toBe(0);
	expect(RoomController.getInstance().getRoom(roomcode).players[0].objects[blackExemption]).toBe(0);
});

test('Checks "addPoints/removePoints" methods', () => {
	let room = RoomSampleService.getTestRoomWithTenPlayers(); // Gets room with roomcode 'TEST'
	let { roomcode } = room;
	RoomController.getInstance().setRoom(room);

	expect(RoomController.getInstance().getRoom(roomcode).points).toBe(0);

	RoomController.getInstance().addPoints(roomcode);
	expect(RoomController.getInstance().getRoom(roomcode).points).toBe(1);

	RoomController.getInstance().addPoints(roomcode);
	expect(RoomController.getInstance().getRoom(roomcode).points).toBe(2);

	RoomController.getInstance().addPoints(roomcode, 1);
	expect(RoomController.getInstance().getRoom(roomcode).points).toBe(3);

	RoomController.getInstance().addPoints(roomcode, 3);
	expect(RoomController.getInstance().getRoom(roomcode).points).toBe(6);

	RoomController.getInstance().removePoints(roomcode);
	expect(RoomController.getInstance().getRoom(roomcode).points).toBe(5);

	RoomController.getInstance().removePoints(roomcode, 1);
	expect(RoomController.getInstance().getRoom(roomcode).points).toBe(4);

	RoomController.getInstance().removePoints(roomcode, 2);
	expect(RoomController.getInstance().getRoom(roomcode).points).toBe(2);

	RoomController.getInstance().removePoints(roomcode, 3);
	expect(RoomController.getInstance().getRoom(roomcode).points).toBe(0);
});

test('Checks "moveNext" method', () => {
	let room = RoomSampleService.getTestRoomWithTenPlayers(); // Gets room with roomcode 'TEST'
	let { roomcode } = room;
	RoomController.getInstance().setRoom(room);

	expect(RoomController.getInstance().getRoom(roomcode).state).toBe(ROOM_STATE.LOBBY);

	RoomController.getInstance().moveNext({ roomcode });

	expect(RoomController.getInstance().getRoom(roomcode).state).toBe(ROOM_STATE.WELCOME);
});

test('Checks "quizDone" method', () => {}); //TODO
