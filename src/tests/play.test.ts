import ChallengeController from '../controllers/challenge.controller';
import RoomController from '../controllers/room.controller';
import Player from '../models/player.model';
import { getMockRoomController } from '../models/samples/room-controller.sample';

jest.useFakeTimers();

function getMockChallengeController(roomController: RoomController) {
	return new ChallengeController(roomController);
}

function getMockComponents() {
	let roomController = getMockRoomController();
	let challengeController = getMockChallengeController(roomController);

	return { roomController, challengeController };
}

test('Plays through the entire game', () => {
	let { roomController, challengeController } = getMockComponents();
	let room = roomController.addRoom('en');
	let { roomcode } = room;

	roomController.setChallengeDataForRoom(roomcode);

	roomController.addPlayerToRoom(roomcode, new Player('test1'));
	roomController.addPlayerToRoom(roomcode, new Player('test2'));
	roomController.addPlayerToRoom(roomcode, new Player('test3'));
	roomController.addPlayerToRoom(roomcode, new Player('test4'));
	roomController.addPlayerToRoom(roomcode, new Player('test5'));
	roomController.addPlayerToRoom(roomcode, new Player('test6'));
	roomController.addPlayerToRoom(roomcode, new Player('test7'));
	roomController.addPlayerToRoom(roomcode, new Player('test8'));
	roomController.addPlayerToRoom(roomcode, new Player('test9'));
	roomController.addPlayerToRoom(roomcode, new Player('test10'));

	roomController.moveNext(roomcode);
});
