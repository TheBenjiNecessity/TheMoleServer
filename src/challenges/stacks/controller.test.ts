import RoomController from '../../controllers/room.controller';
import Player from '../../models/player.model';
import Room from '../../models/room.model';
import EpisodeSampleService from '../../services/sample/episode.sample';
import RoomSampleService from '../../services/sample/room.sample';
import WebSocketService from '../../services/websocket.service';
import StacksChallengeController from './controller';
import StacksChallengeData from './data';
import StacksChallenge, { IPilesGenerator, Pile } from './model';

let rooms: { [id: string]: Room } = {};

class PilesGenerator implements IPilesGenerator {
	constructor() {}

	generatePiles(players: Player[]): { [id: string]: Pile } {
		let piles: { [id: string]: Pile } = {};

		piles[players[0].name] = { player: players[0], amount: -5, numSelected: 0 };
		piles[players[1].name] = { player: players[1], amount: -3, numSelected: 0 };
		piles[players[2].name] = { player: players[2], amount: -1, numSelected: 0 };
		piles[players[3].name] = { player: players[3], amount: 1, numSelected: 0 };
		piles[players[4].name] = { player: players[4], amount: 3, numSelected: 0 };
		piles[players[5].name] = { player: players[5], amount: 5, numSelected: 0 };

		return piles;
	}
}

function getMockRoomController(): RoomController {
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

function getMockStacksChallengeController(roomController: RoomController): StacksChallengeController {
	return new StacksChallengeController(roomController);
}

function getMockRoom(): Room {
	let room = RoomSampleService.getTestRoomForNumPlayers(6);
	const stacksChallengeData = new StacksChallengeData();
	stacksChallengeData.initModel(room.playersStillPlaying, 'en');
	stacksChallengeData.model = new StacksChallenge(room.playersStillPlaying, '', '', [], new PilesGenerator());
	room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallengeData(room.playersStillPlaying, [
		stacksChallengeData
	]);

	return room;
}

function getMockComponents() {
	let room = getMockRoom();
	let roomController = getMockRoomController();
	let stacksChallengeController = getMockStacksChallengeController(roomController);

	roomController.setRoom(room);

	return { room, roomController, stacksChallengeController };
}

test('Checks selectAmount', () => {
	let { room, roomController, stacksChallengeController } = getMockComponents();
	let { roomcode } = room;
	let players = room.playersStillPlaying;
	let stacksChallenge = room.currentEpisode.currentChallenge as StacksChallenge;

	expect(stacksChallenge.currentRound).toBe(1);
	expect(stacksChallenge.isChallengeOver).toBe(false);

	stacksChallengeController.selectAmount(roomcode, players[0].name, 1);
	stacksChallengeController.selectAmount(roomcode, players[1].name, 1);
	stacksChallengeController.selectAmount(roomcode, players[2].name, 1);
	stacksChallengeController.selectAmount(roomcode, players[3].name, 1);
	stacksChallengeController.selectAmount(roomcode, players[4].name, 1);
	stacksChallengeController.selectAmount(roomcode, players[5].name, 1);

	stacksChallenge = room.currentEpisode.currentChallenge as StacksChallenge;
	room = roomController.getRoom(roomcode);
	expect(room.points).toBe(0);
	expect(stacksChallenge.currentRound).toBe(2);
	expect(stacksChallenge.isChallengeOver).toBe(false);

	stacksChallengeController.selectAmount(roomcode, players[0].name, 1);
	stacksChallengeController.selectAmount(roomcode, players[1].name, 1);
	stacksChallengeController.selectAmount(roomcode, players[2].name, 2);
	stacksChallengeController.selectAmount(roomcode, players[3].name, 2);
	stacksChallengeController.selectAmount(roomcode, players[4].name, 3);
	stacksChallengeController.selectAmount(roomcode, players[5].name, 3);

	stacksChallenge = room.currentEpisode.currentChallenge as StacksChallenge;
	room = roomController.getRoom(roomcode);
	expect(room.points).toBe(0);
	expect(stacksChallenge.currentRound).toBe(3);
	expect(stacksChallenge.isChallengeOver).toBe(false);

	stacksChallengeController.selectAmount(roomcode, players[0].name, 1);
	stacksChallengeController.selectAmount(roomcode, players[1].name, 1);
	stacksChallengeController.selectAmount(roomcode, players[2].name, 2);
	stacksChallengeController.selectAmount(roomcode, players[3].name, 2);
	stacksChallengeController.selectAmount(roomcode, players[4].name, 2);
	stacksChallengeController.selectAmount(roomcode, players[5].name, 3);

	stacksChallenge = room.currentEpisode.currentChallenge as StacksChallenge;
	room = roomController.getRoom(roomcode);
	expect(room.points).toBe(5);
	expect(stacksChallenge.currentRound).toBe(4);
	expect(stacksChallenge.isChallengeOver).toBe(true);
});
