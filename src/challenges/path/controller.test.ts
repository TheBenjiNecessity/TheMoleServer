import PathChallengeController from './controller';
import RoomControllerCreator from '../../controllers/room.controller';
import RoomSampleService from '../../../tests/room.sample';
import EpisodeSampleService from '../../../tests/episode.sample';
import pathData from './data';

test('Checks "chooseChest" method', () => {
	let roomcode = 'TEST';
	let room = RoomSampleService.getTestRoomWithTenPlayers();
	room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallenge(
		room,
		pathData.getModel(room.playersStillPlaying, 'en')
	);
	RoomControllerCreator.getInstance().setRoom(room);

	let pathChallengeController = PathChallengeController.getInstance();
	pathChallengeController.chooseChest({ roomcode, choice: 'left' });
	let pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentEpisode.currentChallenge;

	expect(pathChallenge.currentChoice).toBe('left');

	pathChallengeController.chooseChest({ roomcode, choice: 'right' });
	pathChallenge = RoomControllerCreator.getInstance().getRoom(roomcode).currentEpisode.currentChallenge;

	expect(pathChallenge.currentChoice).toBe('right');
});

test('Checks "addVoteForChest" method', () => {
	let room = RoomSampleService.getTestRoomWithTenPlayers();
	room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallenge(
		room,
		pathData.getModel(room.playersStillPlaying, 'en')
	);
	let player = room.players[0];
	let pathChallenge = room.currentEpisode.currentChallenge;

	pathChallenge.chooseLeft();
	RoomControllerCreator.getInstance().setRoom(room);

	let pathChallengeController = PathChallengeController.getInstance();
	let result = pathChallengeController.addVoteForChest({ roomcode: room.roomcode, player, choice: 'left' });
	expect(pathChallenge.votes.left.length).toBe(1);
	expect(pathChallenge.votes.right.length).toBe(0);
	expect(result.action).toBe('path-vote-chest');
});
