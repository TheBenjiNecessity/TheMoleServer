import PathChallengeControllerCreator from './path-challenge.controller';
import Room from '../../models/room.model';
import RoomControllerCreator from '../room.controller';

test('Checks "chooseChest" method', () => {
	let roomcode = 'TEST';
	let room = Room.getTestRoomWithTenPlayers();
	room.initCurrentChallenge('path');
	RoomControllerCreator.getInstance().setRoom(room);

	let pathChallengeController = PathChallengeControllerCreator.getInstance();
	pathChallengeController.chooseChest({ roomcode, choice: 'left' });
	let pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentChallenge;

	expect(pathChallenge.currentChoice).toBe('left');

	pathChallengeController.chooseChest({ roomcode, choice: 'right' });
	pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentChallenge;

	expect(pathChallenge.currentChoice).toBe('right');
});

test('Checks "addVoteForChest" method', () => {
	let roomcode = 'TEST';
	let room = Room.getTestRoomWithTenPlayers();
	let player = room.players[0];
	room.initCurrentChallenge('path');
	RoomControllerCreator.getInstance().setRoom(room);

	let pathChallengeController = PathChallengeControllerCreator.getInstance();
	let result = pathChallengeController.addVoteForChest({ roomcode, player, choice: 'left' });
	room = RoomControllerCreator.getInstance().getRoom(roomcode);
	let pathChallenge = room.currentChallenge;
	expect(pathChallenge.votes.left.length).toBe(1);
	expect(pathChallenge.votes.right.length).toBe(0);
	expect(result.action).toBe('path-vote-chest');
});
