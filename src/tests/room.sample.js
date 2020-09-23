import Room from '../models/room.model';
import Player from '../models/player.model';

export default class RoomSampleService {
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
		return RoomSampleService.getTestRoomForNumPlayers(5);
	}

	static getTestRoomWithFourPlayers() {
		return RoomSampleService.getTestRoomForNumPlayers(4);
	}

	static getTestRoomWithNoPlayers() {
		return new Room('TEST');
	}

	static getTestRoomForNumPlayers(numPlayers) {
		let room = new Room('TEST');

		for (let i = 1; i <= numPlayers; i++) {
			room.addPlayer(new Player(`test${i}`));
		}

		return room;
	}
}
