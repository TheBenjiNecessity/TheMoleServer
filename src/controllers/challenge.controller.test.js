import ChallengeControllerCreator from './challenge.controller';
import Room from '../models/room.model';
import RoomControllerCreator from './room.controller';
import PathChallenge from '../models/challenges/path.challenge';

test('Checks "raiseHand" method', () => {
	let roomcode = 'TEST';
	let room = Room.getTestRoomWithTenPlayers();
	room.currentChallenge = new PathChallenge(room.players);
	RoomControllerCreator.getInstance().setRoom(room);

	let player = room.players[0];

	let challengeController = ChallengeControllerCreator.getInstance();
	challengeController.raiseHand({ roomcode, player, role: 'test' });
	let pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentChallenge;

	expect(pathChallenge.raisedHands.length).toBe(1);
	expect(pathChallenge.raisedHands[0].role).toBe('test');
	expect(pathChallenge.raisedHands[0].player.name).toBe('test1');

	challengeController.raiseHand({ roomcode, player, role: 'test2' });
	pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentChallenge;

	expect(pathChallenge.raisedHands.length).toBe(1);
	expect(pathChallenge.raisedHands[0].role).toBe('test2');
	expect(pathChallenge.raisedHands[0].player.name).toBe('test1');
});
