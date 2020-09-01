import PathChallengeController from '../controllers/challenge-controllers/path-challenge.controller';
import RoomControllerCreator from '../controllers/room.controller';
import PathChallenge from '../models/challenges/path.challenge';
import RoomService from '../services/room/roomcode.service';
import Episode from '../models/episode.model';
import questionData from '../models/quiz/question.data';
import Question from '../models/quiz/question.model';

test('Checks "chooseChest" method', () => {
	let roomcode = 'TEST';
	let room = RoomService.getTestRoomWithTenPlayers();
	let episode = new Episode(
		room.playersStillPlaying,
		[ new PathChallenge(room.playersStillPlaying) ],
		questionData.map((q) => new Question(q.text, q.type, q.choices))
	);
	room.currentEpisode = episode;
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
	let room = RoomService.getTestRoomWithTenPlayers();
	let player = room.players[0];
	let episode = new Episode(
		room.playersStillPlaying,
		[ new PathChallenge(room.playersStillPlaying) ],
		questionData.map((q) => new Question(q.text, q.type, q.choices))
	);

	room.currentEpisode = episode;
	let pathChallenge = room.currentEpisode.currentChallenge;
	pathChallenge.chooseLeft();
	RoomControllerCreator.getInstance().setRoom(room);

	let pathChallengeController = PathChallengeController.getInstance();
	let result = pathChallengeController.addVoteForChest({ roomcode: room.roomcode, player, choice: 'left' });
	expect(pathChallenge.votes.left.length).toBe(1);
	expect(pathChallenge.votes.right.length).toBe(0);
	expect(result.action).toBe('path-vote-chest');
});
