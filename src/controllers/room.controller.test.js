import RoomControllerCreator, { RoomController } from './room.controller';
import PathChallenge from '../models/challenges/path.challenge';
import Room from '../models/room.model';
import Player from '../models/player.model';

const ROOMCODE_REGEX = /[A-Z]{4}/;

test('Checks static getters', () => {
	expect(RoomController.MAX_LETTERS).toBe(4);
	expect(RoomController.CHARACTERS).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
	expect(JSON.stringify(RoomController.BAD_WORDS)).toBe(
		JSON.stringify([ 'SHIT', 'FUCK', 'COCK', 'CUNT', 'SLUT', 'TWAT', 'JIZZ', 'TITS', 'CUMS' ])
	);
});

test('Checks "generateRandomRoomcode" method', () => {
	let roomcode = RoomController.generateRandomRoomcode();

	expect(roomcode.length).toBe(RoomController.MAX_LETTERS);
	expect(ROOMCODE_REGEX.test(roomcode)).toBe(true);
});

test('Checks "roomCodeIsABadWord" method', () => {
	expect(RoomController.roomCodeIsABadWord('TEST')).toBe(false);
	for (let word of RoomController.BAD_WORDS) {
		expect(RoomController.roomCodeIsABadWord(word)).toBe(true);
	}
});

test('Checks "roomCodeAlreadyExists" method', () => {
	let room = Room.getTestRoomWithTenPlayers();
	room.currentChallenge = new PathChallenge(room);
	RoomControllerCreator.getInstance().setRoom(room);

	expect(RoomControllerCreator.getInstance().roomCodeAlreadyExists(room.roomcode)).toBe(true);
	expect(RoomControllerCreator.getInstance().roomCodeAlreadyExists('NOOP')).toBe(false);
});

test('Checks "generateRandomRoomCodeNotUsed" method', () => {
	// TODO: generate all possible room codes in list and remove one for testing?
	let room = Room.getTestRoomWithTenPlayers(); // Gets room with roomcode 'TEST'
	room.currentChallenge = new PathChallenge(room);
	RoomControllerCreator.getInstance().setRoom(room);

	let roomcode = RoomControllerCreator.getInstance().generateRandomRoomCodeNotUsed();

	expect(ROOMCODE_REGEX.test(roomcode)).toBe(true);
	expect(RoomController.roomCodeIsABadWord(roomcode)).toBe(false);
	expect(roomcode !== 'TEST').toBe(true);
	expect(typeof RoomControllerCreator.getInstance().getRoom(roomcode)).toBe('undefined');
});

test('Checks "addRoom" method', () => {
	let roomcode = 'TEST';
	let room = new Room(roomcode);
	RoomControllerCreator.getInstance().addRoom(room);
	expect(typeof RoomControllerCreator.getInstance().rooms[roomcode]).toBe('object');
	expect(RoomControllerCreator.getInstance().rooms[roomcode].roomcode).toBe(roomcode);
});

test('Checks getRoom/setRoom methods', () => {
	let room = Room.getTestRoomWithTenPlayers(); // Gets room with roomcode 'TEST'
	let { roomcode } = room;
	room.currentChallenge = new PathChallenge(room);
	RoomControllerCreator.getInstance().setRoom(room);

	expect(typeof RoomControllerCreator.getInstance().rooms[roomcode]).toBe('object');
	expect(RoomControllerCreator.getInstance().rooms[roomcode].roomcode).toBe(roomcode);
	expect(typeof RoomControllerCreator.getInstance().getRoom('TEST')).toBe('object');
	expect(RoomControllerCreator.getInstance().getRoom('TEST').roomcode).toBe('TEST');
});

test('Checks "addPlayerToRoom" method', () => {
	let room = Room.getTestRoomWithNoPlayers(); // Gets room with roomcode 'TEST'
	room.currentChallenge = new PathChallenge(room);
	RoomControllerCreator.getInstance().setRoom(room);

	RoomControllerCreator.getInstance().addPlayerToRoom('TEST', new Player('test11'));

	expect(RoomControllerCreator.getInstance().getRoom('TEST').players.length).toBe(1);
	expect(RoomControllerCreator.getInstance().getRoom('TEST').players[0].name).toBe('test11');

	RoomControllerCreator.getInstance().addPlayerToRoom('TEST', new Player('test11'));

	expect(RoomControllerCreator.getInstance().getRoom('TEST').players.length).toBe(1);
	expect(RoomControllerCreator.getInstance().getRoom('TEST').players[0].name).toBe('test11');

	RoomControllerCreator.getInstance().addPlayerToRoom('TEST', new Player('test12'));

	expect(RoomControllerCreator.getInstance().getRoom('TEST').players.length).toBe(2);
	expect(RoomControllerCreator.getInstance().getRoom('TEST').players[1].name).toBe('test12');
});

test('Checks "giveObjectsToPlayer/removeObjectsFromPlayer" methods', () => {
	let room = Room.getTestRoomWithTenPlayers(); // Gets room with roomcode 'TEST'
	let { roomcode } = room;
	let exemption = 'exemption';
	let joker = 'joker';
	let blackExemption = 'black-exemption';
	room.currentChallenge = new PathChallenge(room);
	RoomControllerCreator.getInstance().setRoom(room);

	let player = room.players[0];

	RoomControllerCreator.getInstance().giveObjectsToPlayer(roomcode, player.name, exemption, 2);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).players[0].objects[exemption]).toBe(2);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).players[0].objects[joker]).toBe(0);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).players[0].objects[blackExemption]).toBe(0);

	RoomControllerCreator.getInstance().giveObjectsToPlayer(roomcode, player.name, joker, 2);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).players[0].objects[exemption]).toBe(2);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).players[0].objects[joker]).toBe(2);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).players[0].objects[blackExemption]).toBe(0);

	RoomControllerCreator.getInstance().giveObjectsToPlayer(roomcode, player.name, blackExemption, 2);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).players[0].objects[exemption]).toBe(2);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).players[0].objects[joker]).toBe(2);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).players[0].objects[blackExemption]).toBe(2);

	RoomControllerCreator.getInstance().removeObjectsFromPlayer(roomcode, player.name, exemption, 1);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).players[0].objects[exemption]).toBe(1);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).players[0].objects[joker]).toBe(2);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).players[0].objects[blackExemption]).toBe(2);

	RoomControllerCreator.getInstance().removeObjectsFromPlayer(roomcode, player.name, joker, 2);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).players[0].objects[exemption]).toBe(1);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).players[0].objects[joker]).toBe(0);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).players[0].objects[blackExemption]).toBe(2);

	RoomControllerCreator.getInstance().removeObjectsFromPlayer(roomcode, player.name, blackExemption, 3);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).players[0].objects[exemption]).toBe(1);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).players[0].objects[joker]).toBe(0);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).players[0].objects[blackExemption]).toBe(0);
});

test('Checks "addPoints/removePoints" methods', () => {
	let room = Room.getTestRoomWithTenPlayers(); // Gets room with roomcode 'TEST'
	let { roomcode } = room;
	RoomControllerCreator.getInstance().setRoom(room);

	expect(RoomControllerCreator.getInstance().getRoom(roomcode).points).toBe(0);

	RoomControllerCreator.getInstance().addPoints(roomcode);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).points).toBe(1);

	RoomControllerCreator.getInstance().addPoints(roomcode);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).points).toBe(2);

	RoomControllerCreator.getInstance().addPoints(roomcode, 1);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).points).toBe(3);

	RoomControllerCreator.getInstance().addPoints(roomcode, 3);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).points).toBe(6);

	RoomControllerCreator.getInstance().removePoints(roomcode);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).points).toBe(5);

	RoomControllerCreator.getInstance().removePoints(roomcode, 1);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).points).toBe(4);

	RoomControllerCreator.getInstance().removePoints(roomcode, 2);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).points).toBe(2);

	RoomControllerCreator.getInstance().removePoints(roomcode, 3);
	expect(RoomControllerCreator.getInstance().getRoom(roomcode).points).toBe(0);
});

test('Checks "moveNext" method', () => {
	let room = Room.getTestRoomWithTenPlayers(); // Gets room with roomcode 'TEST'
	let { roomcode } = room;
	RoomControllerCreator.getInstance().setRoom(room);

	expect(RoomControllerCreator.getInstance().getRoom(roomcode).state).toBe(Room.ROOM_STATE.LOBBY);

	RoomControllerCreator.getInstance().moveNext(roomcode);

	expect(RoomControllerCreator.getInstance().getRoom(roomcode).state).toBe(Room.ROOM_STATE.WELCOME);
});
