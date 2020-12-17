import RoomSampleService from '../../services/sample/room.sample';
import OutAndSafeChallengeData from './data';
import OutAndSafeChallenge from './model';
import Room from '../../models/room.model';
import WebSocketService from '../../services/websocket.service';
import RoomController from '../../controllers/room.controller';
import ChallengeController from '../../controllers/challenge.controller';
import OutAndSafeChallengeController from './controller';
import EpisodeSampleService from '../../services/sample/episode.sample';

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

function getMockOutAndSafeChallengeController(roomController: RoomController) {
	return new OutAndSafeChallengeController(roomController);
}

function getMockRoom() {
	const room = RoomSampleService.getTestRoomForNumPlayers(5);
	const outAndSafeChallengeData = new OutAndSafeChallengeData();
	outAndSafeChallengeData.initModel(room.playersStillPlaying, 'en');
	room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallenge(room, outAndSafeChallengeData);
	return room;
}

function getMockComponents() {
	let room = getMockRoom();
	let roomController = getMockRoomController();
	let outAndSafeChallengeController = getMockOutAndSafeChallengeController(roomController);

	roomController.setRoom(room);

	return { room, roomController, outAndSafeChallengeController };
}

test('Plays the game where everyone plays all of their safe cards first and then all of their out cards', () => {
	let { room, roomController, outAndSafeChallengeController } = getMockComponents();
	let player1Name = room.playersStillPlaying[0].name;
	let player2Name = room.playersStillPlaying[1].name;
	let player3Name = room.playersStillPlaying[2].name;
	let player4Name = room.playersStillPlaying[3].name;
	let player5Name = room.playersStillPlaying[4].name;
	let outAndSafeChallenge = roomController.getRoom(room.roomcode).currentEpisode
		.currentChallenge as OutAndSafeChallenge;

	outAndSafeChallengeController.selectCard(room.roomcode, player1Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player2Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player3Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player4Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player5Name, 'safe');
	outAndSafeChallenge = roomController.getRoom(room.roomcode).currentEpisode.currentChallenge as OutAndSafeChallenge;

	expect(outAndSafeChallenge.currentRound).toBe(2);
	expect(outAndSafeChallenge.state).toBe('game');

	outAndSafeChallengeController.selectCard(room.roomcode, player1Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player2Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player3Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player4Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player5Name, 'safe');
	outAndSafeChallenge = roomController.getRoom(room.roomcode).currentEpisode.currentChallenge as OutAndSafeChallenge;

	expect(outAndSafeChallenge.currentRound).toBe(3);
	expect(outAndSafeChallenge.state).toBe('game');

	outAndSafeChallengeController.selectCard(room.roomcode, player1Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player2Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player3Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player4Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player5Name, 'safe');
	outAndSafeChallenge = roomController.getRoom(room.roomcode).currentEpisode.currentChallenge as OutAndSafeChallenge;

	expect(outAndSafeChallenge.currentRound).toBe(4);
	expect(outAndSafeChallenge.state).toBe('game');

	outAndSafeChallengeController.selectCard(room.roomcode, player1Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player2Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player3Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player4Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player5Name, 'safe');
	outAndSafeChallenge = roomController.getRoom(room.roomcode).currentEpisode.currentChallenge as OutAndSafeChallenge;

	expect(outAndSafeChallenge.currentRound).toBe(5);
	expect(outAndSafeChallenge.state).toBe('game');

	outAndSafeChallengeController.selectCard(room.roomcode, player1Name, 'out');
	outAndSafeChallengeController.selectCard(room.roomcode, player2Name, 'out');
	outAndSafeChallengeController.selectCard(room.roomcode, player3Name, 'out');
	outAndSafeChallengeController.selectCard(room.roomcode, player4Name, 'out');
	outAndSafeChallengeController.selectCard(room.roomcode, player5Name, 'out');
	outAndSafeChallenge = roomController.getRoom(room.roomcode).currentEpisode.currentChallenge as OutAndSafeChallenge;

	expect(outAndSafeChallenge.state).toBe('end');

	room = roomController.getRoom(room.roomcode);

	expect(room.points).toBe(0);
});

test('Plays the game where everyone plays all of their out cards first', () => {
	let { room, roomController, outAndSafeChallengeController } = getMockComponents();
	let player1Name = room.playersStillPlaying[0].name;
	let player2Name = room.playersStillPlaying[1].name;
	let player3Name = room.playersStillPlaying[2].name;
	let player4Name = room.playersStillPlaying[3].name;
	let player5Name = room.playersStillPlaying[4].name;
	let outAndSafeChallenge = roomController.getRoom(room.roomcode).currentEpisode
		.currentChallenge as OutAndSafeChallenge;

	outAndSafeChallengeController.selectCard(room.roomcode, player1Name, 'out');
	outAndSafeChallengeController.selectCard(room.roomcode, player2Name, 'out');
	outAndSafeChallengeController.selectCard(room.roomcode, player3Name, 'out');
	outAndSafeChallengeController.selectCard(room.roomcode, player4Name, 'out');
	outAndSafeChallengeController.selectCard(room.roomcode, player5Name, 'out');
	room = roomController.getRoom(room.roomcode);
	outAndSafeChallenge = room.currentEpisode.currentChallenge as OutAndSafeChallenge;

	expect(outAndSafeChallenge.state).toBe('end');
	expect(room.points).toBe(0);
});

test('Plays the game where the players win (one out card played)', () => {
	let { room, roomController, outAndSafeChallengeController } = getMockComponents();
	let player1Name = room.playersStillPlaying[0].name;
	let player2Name = room.playersStillPlaying[1].name;
	let player3Name = room.playersStillPlaying[2].name;
	let player4Name = room.playersStillPlaying[3].name;
	let player5Name = room.playersStillPlaying[4].name;
	let outAndSafeChallenge = roomController.getRoom(room.roomcode).currentEpisode
		.currentChallenge as OutAndSafeChallenge;

	outAndSafeChallengeController.selectCard(room.roomcode, player1Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player2Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player3Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player4Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player5Name, 'safe');
	outAndSafeChallenge = roomController.getRoom(room.roomcode).currentEpisode.currentChallenge as OutAndSafeChallenge;

	expect(outAndSafeChallenge.currentRound).toBe(2);
	expect(outAndSafeChallenge.state).toBe('game');

	outAndSafeChallengeController.selectCard(room.roomcode, player1Name, 'out');
	outAndSafeChallengeController.selectCard(room.roomcode, player2Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player3Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player4Name, 'safe');
	outAndSafeChallengeController.selectCard(room.roomcode, player5Name, 'safe');
	room = roomController.getRoom(room.roomcode);
	outAndSafeChallenge = room.currentEpisode.currentChallenge as OutAndSafeChallenge;

	expect(outAndSafeChallenge.state).toBe('end');
	expect(room.points).toBe(10);
});
