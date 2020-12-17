import Room from '../../models/room.model';
import WebSocketService from '../../services/websocket.service';
import RoomController from '../../controllers/room.controller';
import PathChallengeController from './controller';
import EpisodeSampleService from '../../services/sample/episode.sample';
import RoomSampleService from '../../services/sample/room.sample';
import PathChallenge, { IWalkersGenerator, IChestsGenerator, Chest } from './model';
import Player from '../../models/player.model';
import Challenge from '../../models/challenge.model';
import PathChallengeData from './data';

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
	let room = RoomSampleService.getTestRoomForNumPlayers(5);
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

test('Plays through an entire game where all players make it to the end', () => {
	let { room, roomController, pathChallengeController } = getMockComponents();
	let { roomcode } = room;
	let pathChallenge = room.currentEpisode.currentChallenge as PathChallenge;

	while (pathChallenge && !pathChallenge.challengeIsDone) {
		let direction = pathChallenge.currentChest.left === 'continue' ? 'left' : 'right';
		pathChallengeController.chooseChest(roomcode, direction);
		for (let player of pathChallenge.playersNotWalker) {
			pathChallengeController.addVoteForChest(roomcode, player, direction);
			room = roomController.getRoom(roomcode);
			pathChallenge = room.currentEpisode.currentChallenge as PathChallenge;
			if (pathChallenge.hasMajorityVote) {
				break;
			}
		}
	}

	room = roomController.getRoom(roomcode);
	pathChallenge = roomController.getRoom(roomcode).currentEpisode.currentChallenge as PathChallenge;

	expect(pathChallenge.state).toBe(Challenge.CHALLENGE_STATES.CHALLENGE_END);
	expect(room.points).toBe(35);
});

test('Plays through an entire game where all but one player makes it to the end', () => {
	let { room, roomController, pathChallengeController } = getMockComponents();
	let { roomcode } = room;
	let pathChallenge = room.currentEpisode.currentChallenge as PathChallenge;
	while (pathChallenge && pathChallenge.walkers.length > 0) {
		let direction = pathChallenge.currentChest.left === 'continue' ? 'left' : 'right';
		pathChallengeController.chooseChest(roomcode, direction);
		for (let player of pathChallenge.playersNotWalker) {
			pathChallengeController.addVoteForChest(roomcode, player, direction);
			room = roomController.getRoom(roomcode);
			pathChallenge = room.currentEpisode.currentChallenge as PathChallenge;
			if (pathChallenge.hasMajorityVote) {
				break;
			}
		}
	}

	pathChallengeController.chooseChest(roomcode, 'right');
	for (let player of pathChallenge.playersNotWalker) {
		pathChallengeController.addVoteForChest(roomcode, player, 'right');
		room = roomController.getRoom(roomcode);
		pathChallenge = room.currentEpisode.currentChallenge as PathChallenge;
		if (pathChallenge.hasMajorityVote) {
			break;
		}
	}

	room = roomController.getRoom(roomcode);
	pathChallenge = roomController.getRoom(roomcode).currentEpisode.currentChallenge as PathChallenge;

	expect(pathChallenge.state).toBe(Challenge.CHALLENGE_STATES.CHALLENGE_END);
	expect(room.points).toBe(28);
	expect(room.playersStillPlaying[4].numExemptions).toBe(1);
});

test('Plays through an entire game where no players make it though', () => {
	let { room, roomController, pathChallengeController } = getMockComponents();
	let { roomcode } = room;
	let pathChallenge = room.currentEpisode.currentChallenge as PathChallenge;
	while (pathChallenge && !pathChallenge.challengeIsDone) {
		pathChallengeController.chooseChest(roomcode, 'left');
		for (let player of pathChallenge.playersNotWalker) {
			pathChallengeController.addVoteForChest(roomcode, player, 'right');
			room = roomController.getRoom(roomcode);
			pathChallenge = room.currentEpisode.currentChallenge as PathChallenge;
			if (pathChallenge.hasMajorityVote) {
				break;
			}
		}
	}

	room = roomController.getRoom(roomcode);
	pathChallenge = roomController.getRoom(roomcode).currentEpisode.currentChallenge as PathChallenge;

	expect(pathChallenge.state).toBe(Challenge.CHALLENGE_STATES.CHALLENGE_END);
	expect(room.points).toBe(0);
	for (let player of room.playersStillPlaying) {
		expect(player.numExemptions).toBe(1);
	}
});
