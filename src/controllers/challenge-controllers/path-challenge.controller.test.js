import PathChallengeController from './path-challenge.controller';
import RoomControllerCreator from '../room.controller';
import PathChallenge from '../../models/challenges/path.challenge';
import RoomService from '../../services/room/roomcode.service';

test('Checks "chooseChest" method', () => {
	let roomcode = 'TEST';
	let room = RoomService.getTestRoomWithTenPlayers();
	room.currentChallenge = new PathChallenge(room);
	RoomControllerCreator.getInstance().setRoom(room);

	let pathChallengeController = PathChallengeController.getInstance();
	pathChallengeController.chooseChest({ roomcode, choice: 'left' });
	let pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentChallenge;

	expect(pathChallenge.currentChoice).toBe('left');

	pathChallengeController.chooseChest({ roomcode, choice: 'right' });
	pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentChallenge;

	expect(pathChallenge.currentChoice).toBe('right');
});

test('Checks "addVoteForChest" method', () => {
	let roomcode = 'TEST';
	let room = RoomService.getTestRoomWithTenPlayers();
	let player = room.players[0];
	room.currentChallenge = new PathChallenge(room);
	RoomControllerCreator.getInstance().setRoom(room);

	let pathChallengeController = PathChallengeController.getInstance();
	let result = pathChallengeController.addVoteForChest({ roomcode, player, choice: 'left' });
	room = RoomControllerCreator.getInstance().getRoom(roomcode);
	let pathChallenge = room.currentChallenge;
	expect(pathChallenge.votes.left.length).toBe(1);
	expect(pathChallenge.votes.right.length).toBe(0);
	expect(result.action).toBe('path-vote-chest');
});
