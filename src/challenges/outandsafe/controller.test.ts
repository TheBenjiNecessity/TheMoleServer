import RoomSampleService from '../../models/samples/room.sample';
import OutAndSafeChallengeData from './data';
import OutAndSafeChallenge from './model';
import Room from '../../models/room.model';
import WebSocketService from '../../services/websocket.service';
import RoomController from '../../controllers/room.controller';
import ChallengeController from '../../controllers/challenge.controller';
import OutAndSafeChallengeController from './controller';
import EpisodeSampleService from '../../models/samples/episode.sample';

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
	let room = RoomSampleService.getTestRoomForNumPlayers(5);
	let buttonChallenge = new OutAndSafeChallengeData().getModel(room.playersStillPlaying, 'en') as OutAndSafeChallenge;
	room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallenge(room, buttonChallenge);
	return room;
}

function getMockComponents() {
	let room = getMockRoom();
	let roomController = getMockRoomController();
	let outAndSafeChallengeController = getMockOutAndSafeChallengeController(roomController);

	roomController.setRoom(room);

	return { room, roomController, outAndSafeChallengeController };
}

test('Checks selectCard method', () => {
	let { room, roomController, outAndSafeChallengeController } = getMockComponents();
	let player1Name = room.playersStillPlaying[0].name;
	let player2Name = room.playersStillPlaying[1].name;
	let player3Name = room.playersStillPlaying[2].name;
	let player4Name = room.playersStillPlaying[3].name;
	let player5Name = room.playersStillPlaying[4].name;

	outAndSafeChallengeController.selectCard(room.roomcode, player1Name, 'safe');

	let outAndSafeChallenge = room.currentEpisode.currentChallenge as OutAndSafeChallenge;
	expect(outAndSafeChallenge.currentSelectedCards[player1Name]).toBe('safe');
	expect(outAndSafeChallenge.currentSelectedCards[player2Name]).toBe(null);
	expect(outAndSafeChallenge.currentSelectedCards[player3Name]).toBe(null);
	expect(outAndSafeChallenge.currentSelectedCards[player4Name]).toBe(null);
	expect(outAndSafeChallenge.currentSelectedCards[player5Name]).toBe(null);

	expect(outAndSafeChallenge.playerHands[player1Name].filter((c) => c === 'safe').length).toBe(3);
	expect(outAndSafeChallenge.playerHands[player1Name].filter((c) => c === 'out').length).toBe(1);

	expect(outAndSafeChallenge.playerHands[player2Name].filter((c) => c === 'safe').length).toBe(4);
	expect(outAndSafeChallenge.playerHands[player2Name].filter((c) => c === 'out').length).toBe(1);
	expect(outAndSafeChallenge.playerHands[player3Name].filter((c) => c === 'safe').length).toBe(4);
	expect(outAndSafeChallenge.playerHands[player3Name].filter((c) => c === 'out').length).toBe(1);
	expect(outAndSafeChallenge.playerHands[player4Name].filter((c) => c === 'safe').length).toBe(4);
	expect(outAndSafeChallenge.playerHands[player4Name].filter((c) => c === 'out').length).toBe(1);
	expect(outAndSafeChallenge.playerHands[player5Name].filter((c) => c === 'safe').length).toBe(4);
	expect(outAndSafeChallenge.playerHands[player5Name].filter((c) => c === 'out').length).toBe(1);

	outAndSafeChallengeController.selectCard(room.roomcode, player2Name, 'safe');
	outAndSafeChallenge = room.currentEpisode.currentChallenge as OutAndSafeChallenge;

	outAndSafeChallengeController.selectCard(room.roomcode, player3Name, 'safe');
	outAndSafeChallenge = room.currentEpisode.currentChallenge as OutAndSafeChallenge;

	outAndSafeChallengeController.selectCard(room.roomcode, player4Name, 'safe');
	outAndSafeChallenge = room.currentEpisode.currentChallenge as OutAndSafeChallenge;

	outAndSafeChallengeController.selectCard(room.roomcode, player5Name, 'safe');
	outAndSafeChallenge = room.currentEpisode.currentChallenge as OutAndSafeChallenge;

	expect(outAndSafeChallenge.currentRound).toBe(2);
	expect(outAndSafeChallenge.state).toBe('game');
});
