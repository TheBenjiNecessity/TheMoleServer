import PathChallengeController from './controller';
import RoomControllerCreator from '../../controllers/room.controller';
import RoomSampleService from '../../models/samples/room.sample';
import EpisodeSampleService from '../../models/samples/episode.sample';
import pathData from './data';
import RoomController from '../../controllers/room.controller';
import Room from '../../models/room.model';
import WebSocketService from '../../services/websocket.service';
import ChallengeController from '../../controllers/challenge.controller';
import PathChallenge from './model';
import PathChallengeData from './data';

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

function getMockPathChallengeController(roomController: RoomController) {
	let challengeController = new ChallengeController(roomController);
	return new PathChallengeController(roomController, challengeController);
}

function getMockRoom() {
	let room = RoomSampleService.getTestRoomForNumPlayers(4);
	room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallenge(room, new PathChallengeData().getModel(
		room.playersStillPlaying,
		'en'
	) as PathChallenge);
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
	let player = room.players.find((p) => p.name !== pathChallenge.currentWalker.name);

	expect(typeof player !== 'undefined').toBe(true);

	pathChallengeController.chooseChest(room.roomcode, 'left');

	let result = pathChallengeController.addVoteForChest(room.roomcode, player, 'left');

	room = roomController.getRoom(room.roomcode);
	pathChallenge = room.currentEpisode.currentChallenge as PathChallenge;

	expect(pathChallenge.votes.left.length).toBe(1);
	expect(pathChallenge.votes.right.length).toBe(0);
	expect(result).toBe('path-vote-chest');
});
