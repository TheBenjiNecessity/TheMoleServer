import ChallengeController from './challenge.controller';
import RoomControllerCreator from './room.controller';
import PathChallenge from '../models/challenges/path.challenge';
import RoomService from '../services/room/roomcode.service';

test('Checks "raiseHand" method', () => {
	let roomcode = 'TEST';
	let room = RoomService.getTestRoomWithTenPlayers();
	room.currentEpisode.currentChallenge = new PathChallenge(room);
	RoomControllerCreator.getInstance().setRoom(room);

	let player = room.players[0];

	let challengeController = ChallengeController.getInstance();
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
	let room = RoomService.getTestRoomWithTenPlayers();
	room.currentEpisode.currentChallenge = new PathChallenge(room);
	RoomControllerCreator.getInstance().setRoom(room);

	let player = room.players[0];

	let challengeController = ChallengeController.getInstance();
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
	let room = RoomService.getTestRoomWithTenPlayers();
	room.currentEpisode.currentChallenge = new PathChallenge(room);
	RoomControllerCreator.getInstance().setRoom(room);

	let player = room.players[0];

	let challengeController = ChallengeController.getInstance();
	challengeController.addPlayerVote({ roomcode, player });
	let pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentChallenge;

	expect(pathChallenge.votedPlayers[player.name]).toBe(1);
});

test('Checks "removePlayerVote" method', () => {
	//TODO
	let room = RoomService.getTestRoomWithTenPlayers();
	let { roomcode } = room;
	let player = room.players[0];
	room.currentEpisode.currentChallenge = new PathChallenge(room);
	RoomControllerCreator.getInstance().setRoom(room);
	let pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentChallenge;

	expect(typeof pathChallenge.votedPlayers[player.name]).toBe('undefined');

	ChallengeController.getInstance().removePlayerVote({ roomcode, player });
	pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentChallenge;

	expect(typeof pathChallenge.votedPlayers[player.name]).toBe('undefined');

	ChallengeController.getInstance().addPlayerVote({ roomcode, player });
	ChallengeController.getInstance().removePlayerVote({ roomcode, player });
	pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentChallenge;

	expect(typeof pathChallenge.votedPlayers[player.name]).toBe('undefined');
});
