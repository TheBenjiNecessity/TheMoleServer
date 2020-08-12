import QuizService from './quiz.service';
import RoomService from '../room/roomcode.service';
import RoomControllerCreator from '../../controllers/room.controller';

test('Checks getQuiz method', () => {
	let room = RoomService.getTestRoomWithTenPlayers();
	let { roomcode } = room;
	RoomControllerCreator.getInstance().setRoom(room);
	let questions = QuizService.getQuiz(roomcode, episode);
	expect(EpisodeService.getNumChallenges(10)).toBe(3);
});

test('Checks getFinalQuizQuestion method', () => {
	getFinalQuizQuestion(room);
	expect(EpisodeService.getNumChallenges(10)).toBe(3);
});

test('Checks createQuestion method', () => {
	createQuestion(room, text, type, choices);
	expect(EpisodeService.getNumChallenges(10)).toBe(3);
});
