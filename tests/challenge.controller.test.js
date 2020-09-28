import ChallengeController from '../src/controllers/challenge.controller';
import RoomControllerCreator from '../src/controllers/room.controller';
import RoomSampleService from '../tests/room.sample';
import EpisodeSampleService from '../tests/episode.sample';

test.skip('Checks "raiseHand" method', () => {
	//TODO: need to create role based challenge for this too work
	let roomcode = 'TEST';
	let room = RoomSampleService.getTestRoomWithTenPlayers();
	room.currentEpisode = EpisodeSampleService.getTestEpisode(room);
	RoomControllerCreator.getInstance().setRoom(room);

	let player = room.players[0];

	let challengeController = ChallengeController.getInstance();
	challengeController.raiseHand({ roomcode, player, role: 'test' });
	let pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentEpisode.currentChallenge;

	expect(pathChallenge.raisedHands.length).toBe(1);
	expect(pathChallenge.raisedHands[0].role).toBe('test');
	expect(pathChallenge.raisedHands[0].player.name).toBe('test1');

	challengeController.raiseHand({ roomcode, player, role: 'test2' });
	pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentEpisode.currentChallenge;

	expect(pathChallenge.raisedHands.length).toBe(1);
	expect(pathChallenge.raisedHands[0].role).toBe('test2');
	expect(pathChallenge.raisedHands[0].player.name).toBe('test1');
});

test.skip('Checks "agreeToRoles" method', () => {
	let roomcode = 'TEST';
	let room = RoomSampleService.getTestRoomWithTenPlayers();
	room.currentEpisode = EpisodeSampleService.getTestEpisode(room);
	RoomControllerCreator.getInstance().setRoom(room);

	let player = room.players[0];

	let challengeController = ChallengeController.getInstance();
	challengeController.agreeToRoles({ roomcode, player });
	let pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentEpisode.currentChallenge;

	expect(pathChallenge.agreedPlayers.length).toBe(1);
	expect(pathChallenge.agreedPlayers[0].name).toBe('test1');

	challengeController.agreeToRoles({ roomcode, player });
	pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentEpisode.currentChallenge;

	expect(pathChallenge.agreedPlayers.length).toBe(1);
	expect(pathChallenge.agreedPlayers[0].name).toBe('test1');
});

test('Checks "addPlayerVote" method', () => {
	let room = RoomSampleService.getTestRoomWithTenPlayers();
	let { roomcode } = room;
	let player = room.players[0];
	let challengeController = ChallengeController.getInstance();

	room.currentEpisode = EpisodeSampleService.getTestEpisode(room);
	RoomControllerCreator.getInstance().setRoom(room);
	challengeController.addPlayerVote({ roomcode, player });
	let pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentEpisode.currentChallenge;

	expect(Object.keys(pathChallenge.votedPlayers).length).toBe(1);
	expect(pathChallenge.votedPlayers[player.name]).toBe(1);
});

test('Checks "removePlayerVote" method', () => {
	let room = RoomSampleService.getTestRoomWithTenPlayers();
	let { roomcode } = room;
	let player = room.players[0];
	room.currentEpisode = EpisodeSampleService.getTestEpisode(room);
	RoomControllerCreator.getInstance().setRoom(room);
	let challengeController = ChallengeController.getInstance();
	let pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentEpisode.currentChallenge;

	challengeController.addPlayerVote({ roomcode, player });
	pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentEpisode.currentChallenge;
	expect(Object.keys(pathChallenge.votedPlayers).length).toBe(1);
	expect(pathChallenge.votedPlayers[player.name]).toBe(1);

	challengeController.removePlayerVote({ roomcode, player });
	pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentEpisode.currentChallenge;
	expect(Object.keys(pathChallenge.votedPlayers).length).toBe(0);
	expect(typeof pathChallenge.votedPlayers[player.name]).toBe('undefined');

	challengeController.removePlayerVote({ roomcode, player });
	pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentEpisode.currentChallenge;
	expect(Object.keys(pathChallenge.votedPlayers).length).toBe(0);
	expect(typeof pathChallenge.votedPlayers[player.name]).toBe('undefined');
});
