import PathChallengeController from './controller';
import RoomSampleService from '../../models/samples/room.sample';
import EpisodeSampleService from '../../models/samples/episode.sample';
import RoomController from '../../controllers/room.controller';
import Room from '../../models/room.model';
import WebSocketService from '../../services/websocket.service';
import PathChallenge, { Chest, IChestsGenerator, IWalkersGenerator } from './model';
import PathChallengeData from './data';
import Player from '../../models/player.model';

let rooms: { [id: string]: Room } = {};

class WalkersGenerator implements IWalkersGenerator {
	constructor() {}

	getNewWalker(players: Player[]): Player {
		if (!players.length) {
			return null;
		}

		return players[0];
	}
}

class ChestsGenerator implements IChestsGenerator {
	constructor() {}

	getChests(possibleValues: string[]): Chest[] {
		possibleValues = [ 'exemption', 'exemption', 'exemption', 'exemption', 'exemption' ];
		return possibleValues.map((possibleValue) => {
			return { left: 'continue', right: possibleValue };
		});
	}
}

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

function getMockPathChallengeController(roomController: RoomController) {
	return new PathChallengeController(roomController);
}

function getMockRoom() {
	let room = RoomSampleService.getTestRoomForNumPlayers(4);
	const pathChallengeData = new PathChallengeData();
	pathChallengeData.initModel(room.playersStillPlaying, 'en');
	pathChallengeData.model = new PathChallenge(
		room.playersStillPlaying,
		'',
		'',
		[],
		new WalkersGenerator(),
		new ChestsGenerator()
	);
	room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallenge(room, pathChallengeData);
	return room;
}

function getMockComponents() {
	let room = getMockRoom();
	let roomController = getMockRoomController();
	let pathChallengeController = getMockPathChallengeController(roomController);

	roomController.setRoom(room);

	return { room, roomController, pathChallengeController };
}

test('Checks "chooseChest" method', () => {
	let { room, roomController, pathChallengeController } = getMockComponents();

	pathChallengeController.chooseChest(room.roomcode, 'left');
	let pathChallenge = roomController.getRoom(room.roomcode).currentEpisode.currentChallenge as PathChallenge;

	expect(pathChallenge.currentChoice).toBe('left');

	pathChallengeController.chooseChest(room.roomcode, 'right');
	pathChallenge = roomController.getRoom(room.roomcode).currentEpisode.currentChallenge as PathChallenge;

	expect(pathChallenge.currentChoice).toBe('right');
});

test('Checks "addVoteForChest" method', () => {
	let { room, roomController, pathChallengeController } = getMockComponents();
	let pathChallenge = room.currentEpisode.currentChallenge as PathChallenge;
	let walker = pathChallenge.players[0];
	let player1 = pathChallenge.players[1];
	let player2 = pathChallenge.players[2];
	let player3 = pathChallenge.players[3];
	let result = null;

	pathChallengeController.chooseChest(room.roomcode, 'left');

	result = pathChallengeController.addVoteForChest(room.roomcode, player1, 'left');

	room = roomController.getRoom(room.roomcode);
	pathChallenge = room.currentEpisode.currentChallenge as PathChallenge;

	expect(pathChallenge.votes.left.length).toBe(1);
	expect(pathChallenge.votes.right.length).toBe(0);
	expect(result).toBe('path-vote-chest');
	expect(pathChallenge.hasMajorityVote).toBeFalsy();

	result = pathChallengeController.addVoteForChest(room.roomcode, player2, 'left');
});
