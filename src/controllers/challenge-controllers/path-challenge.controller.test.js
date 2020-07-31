import PathChallengeControllerCreator from './path-challenge.controller';
import Room from '../../models/room.model';

test('Checks update room', () => {
	let room = Room.getTestRoomWithTenPlayers();
	room.initCurrentChallenge('path');

	let pathChallengeController = PathChallengeControllerCreator.getInstance();
	let newRoom = pathChallengeController.updateRoom(room, 'left', 'chest');
	let pathChallenge = newRoom.currentChallenge;

	expect(pathChallenge.leftVotes).toBe(0);
	expect(pathChallenge.rightVotes).toBe(0);
});
