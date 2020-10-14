import { ROOM_STATE } from '../src/contants/room.constants';
import RoomController from '../src/controllers/room.controller';
import Player from '../src/models/player.model';
import Room from '../src/models/room.model';
import RoomService from '../src/services/room/room.service';
import RoomSampleService from '../src/models/samples/room.sample';
import WebSocketService from '../src/services/websocket.service';
import EpisodeSampleService from '../src/models/samples/episode.sample';

const ROOMCODE_REGEX = /[A-Z]{4}/;

let rooms: { [id: string]: Room } = {};

function getMockRoomController() {
	rooms = {};
	let webSocketService = new WebSocketService(null);
	return new RoomController(
		webSocketService,
		[],
		() => rooms,
		(r) => {
			rooms = r;
		}
	);
}

function getMockRoom(numPlayers) {
	let room = RoomSampleService.getTestRoomForNumPlayers(numPlayers);
	room.currentEpisode = EpisodeSampleService.getTestEpisode(room);
	return room;
}

function getMockComponents(numPlayers) {
	let room = getMockRoom(numPlayers);
	let roomController = getMockRoomController();

	roomController.setRoom(room);

	return { room, roomController };
}

test('Checks "roomCodeAlreadyExists" method', () => {
	let { room, roomController } = getMockComponents(10);

	expect(roomController.roomCodeAlreadyExists(room.roomcode)).toBe(true);
	expect(roomController.roomCodeAlreadyExists('NOOP')).toBe(false);
});

test('Checks "generateRandomRoomCodeNotUsed" method', () => {
	let { room, roomController } = getMockComponents(10);

	let roomcode = roomController.generateRandomRoomCodeNotUsed();

	expect(ROOMCODE_REGEX.test(roomcode)).toBe(true);
	expect(RoomService.roomCodeIsABadWord(roomcode)).toBe(false);
	expect(roomcode !== 'TEST').toBe(true);
	expect(typeof roomController.getRoom(roomcode)).toBe('undefined');
});

test('Checks "addRoom" method', () => {
	let roomController = getMockRoomController();

	expect(Object.keys(roomController.rooms).length).toBe(0);

	roomController.addRoom();

	expect(Object.keys(roomController.rooms).length).toBe(1);

	roomController.deleteRoom(Object.keys(roomController.rooms)[0]);

	expect(Object.keys(roomController.rooms).length).toBe(0);
});

test('Checks getRoom/setRoom methods', () => {
	let { room, roomController } = getMockComponents(10);
	let { roomcode } = room;

	expect(typeof roomController.rooms[roomcode]).toBe('object');
	expect(roomController.rooms[roomcode].roomcode).toBe(roomcode);
	expect(typeof roomController.getRoom('TEST')).toBe('object');
	expect(roomController.getRoom('TEST').roomcode).toBe('TEST');
});

test('Checks "addPlayerToRoom" method', () => {
	let { room, roomController } = getMockComponents(0);

	// Init test
	expect(roomController.getRoom('TEST').players.length).toBe(0);

	// Test adding first player
	roomController.addPlayerToRoom('TEST', new Player('test11'));

	expect(roomController.getRoom('TEST').players.length).toBe(1);
	expect(roomController.getRoom('TEST').players[0].name).toBe('test11');

	// Test trying to add the same player twice
	roomController.addPlayerToRoom('TEST', new Player('test11'));

	expect(roomController.getRoom('TEST').players.length).toBe(1);
	expect(roomController.getRoom('TEST').players[0].name).toBe('test11');

	// Test adding second player
	roomController.addPlayerToRoom('TEST', new Player('test12'));

	expect(roomController.getRoom('TEST').players.length).toBe(2);
	expect(roomController.getRoom('TEST').players[1].name).toBe('test12');
});

test('Checks "removePlayerToRoom" method', () => {}); //TODO

test('Checks "giveObjectsToPlayer/removeObjectsFromPlayer" methods', () => {
	let { room, roomController } = getMockComponents(10);
	let { roomcode } = room;
	let exemption = 'exemption';
	let joker = 'joker';
	let blackExemption = 'black-exemption';

	let player = room.players[0];

	roomController.giveObjectsToPlayer(roomcode, player.name, exemption, 2);
	expect(roomController.getRoom(roomcode).players[0].objects[exemption]).toBe(2);
	expect(roomController.getRoom(roomcode).players[0].objects[joker]).toBe(0);
	expect(roomController.getRoom(roomcode).players[0].objects[blackExemption]).toBe(0);

	roomController.giveObjectsToPlayer(roomcode, player.name, joker, 2);
	expect(roomController.getRoom(roomcode).players[0].objects[exemption]).toBe(2);
	expect(roomController.getRoom(roomcode).players[0].objects[joker]).toBe(2);
	expect(roomController.getRoom(roomcode).players[0].objects[blackExemption]).toBe(0);

	roomController.giveObjectsToPlayer(roomcode, player.name, blackExemption, 2);
	expect(roomController.getRoom(roomcode).players[0].objects[exemption]).toBe(2);
	expect(roomController.getRoom(roomcode).players[0].objects[joker]).toBe(2);
	expect(roomController.getRoom(roomcode).players[0].objects[blackExemption]).toBe(2);

	roomController.removeObjectsFromPlayer(roomcode, player.name, exemption, 1);
	expect(roomController.getRoom(roomcode).players[0].objects[exemption]).toBe(1);
	expect(roomController.getRoom(roomcode).players[0].objects[joker]).toBe(2);
	expect(roomController.getRoom(roomcode).players[0].objects[blackExemption]).toBe(2);

	roomController.removeObjectsFromPlayer(roomcode, player.name, joker, 2);
	expect(roomController.getRoom(roomcode).players[0].objects[exemption]).toBe(1);
	expect(roomController.getRoom(roomcode).players[0].objects[joker]).toBe(0);
	expect(roomController.getRoom(roomcode).players[0].objects[blackExemption]).toBe(2);

	roomController.removeObjectsFromPlayer(roomcode, player.name, blackExemption, 3);
	expect(roomController.getRoom(roomcode).players[0].objects[exemption]).toBe(1);
	expect(roomController.getRoom(roomcode).players[0].objects[joker]).toBe(0);
	expect(roomController.getRoom(roomcode).players[0].objects[blackExemption]).toBe(0);
});

test('Checks "addPoints/removePoints" methods', () => {
	let { room, roomController } = getMockComponents(10);
	let { roomcode } = room;

	expect(roomController.getRoom(roomcode).points).toBe(0);

	roomController.addPoints(roomcode);
	expect(roomController.getRoom(roomcode).points).toBe(1);

	roomController.addPoints(roomcode);
	expect(roomController.getRoom(roomcode).points).toBe(2);

	roomController.addPoints(roomcode, 1);
	expect(roomController.getRoom(roomcode).points).toBe(3);

	roomController.addPoints(roomcode, 3);
	expect(roomController.getRoom(roomcode).points).toBe(6);

	roomController.removePoints(roomcode);
	expect(roomController.getRoom(roomcode).points).toBe(5);

	roomController.removePoints(roomcode, 1);
	expect(roomController.getRoom(roomcode).points).toBe(4);

	roomController.removePoints(roomcode, 2);
	expect(roomController.getRoom(roomcode).points).toBe(2);

	roomController.removePoints(roomcode, 3);
	expect(roomController.getRoom(roomcode).points).toBe(0);
});

test('Checks "moveNext" method', () => {
	let { room, roomController } = getMockComponents(10);
	let { roomcode } = room;

	expect(roomController.getRoom(roomcode).state).toBe(ROOM_STATE.LOBBY);

	roomController.moveNext(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(ROOM_STATE.WELCOME);
});

test('Checks "quizDone" method', () => {}); //TODO
