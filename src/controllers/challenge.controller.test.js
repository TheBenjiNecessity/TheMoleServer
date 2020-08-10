import ChallengeControllerCreator from './challenge.controller';
import Room from '../models/room.model';
import RoomControllerCreator from './room.controller';
import PathChallenge from '../models/challenges/path.challenge';

test('Checks "raiseHand" method', () => {
	let roomcode = 'TEST';
	let room = Room.getTestRoomWithTenPlayers();
	room.currentChallenge = new PathChallenge(room);
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

test('Checks "agreeToRoles" method', () => {
	let roomcode = 'TEST';
	let room = Room.getTestRoomWithTenPlayers();
	room.currentChallenge = new PathChallenge(room);
	RoomControllerCreator.getInstance().setRoom(room);

	let player = room.players[0];

	let challengeController = ChallengeControllerCreator.getInstance();
	challengeController.agreeToRoles({ roomcode, player });
	let pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentChallenge;

	expect(pathChallenge.agreedPlayers.length).toBe(1);
	expect(pathChallenge.agreedPlayers[0].name).toBe('test1');

	challengeController.agreeToRoles({ roomcode, player });
	pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentChallenge;

	expect(pathChallenge.agreedPlayers.length).toBe(1);
	expect(pathChallenge.agreedPlayers[0].name).toBe('test1');
});

test('Checks "addPlayerVote" method', () => {
	//TODO
	let roomcode = 'TEST';
	let room = Room.getTestRoomWithTenPlayers();
	room.currentChallenge = new PathChallenge(room);
	RoomControllerCreator.getInstance().setRoom(room);

	let player = room.players[0];

	let challengeController = ChallengeControllerCreator.getInstance();
	challengeController.addPlayerVote({ roomcode, player });
	let pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentChallenge;

	expect(pathChallenge.votedPlayers[player.name]).toBe(1);
});

test('Checks "removePlayerVote" method', () => {
	//TODO
	let room = Room.getTestRoomWithTenPlayers();
	let { roomcode } = room;
	let player = room.players[0];
	room.currentChallenge = new PathChallenge(room);
	RoomControllerCreator.getInstance().setRoom(room);
	let pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentChallenge;

	expect(typeof pathChallenge.votedPlayers[player.name]).toBe('undefined');

	ChallengeControllerCreator.getInstance().removePlayerVote({ roomcode, player });
	pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentChallenge;

	expect(typeof pathChallenge.votedPlayers[player.name]).toBe('undefined');

	ChallengeControllerCreator.getInstance().addPlayerVote({ roomcode, player });
	ChallengeControllerCreator.getInstance().removePlayerVote({ roomcode, player });
	pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentChallenge;

	expect(typeof pathChallenge.votedPlayers[player.name]).toBe('undefined');
});
