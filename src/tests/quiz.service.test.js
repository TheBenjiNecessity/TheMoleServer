import QuizService from '../services/game/quiz.service';
import RoomSampleService from '../tests/room.sample';
import { MAX_NUM_QUESTIONS } from '../contants/quiz.constants';
import questionData from '../models/quiz/question.data';
import challengeData from '../models/challenges/challenge.data';
import Question from '../models/quiz/question.model';
import ArrayUtilsService from '../services/utils/array-utils.service';

test('Checks generateQuiz method', () => {
	let room = RoomSampleService.getTestRoomWithTenPlayers();
	let challengeQuestions = challengeData
		.map((c) => c.questions)
		.flat()
		.map((q) => new Question(q.text, q.type, q.choices));
	let unusedGeneralQuestions = questionData.map((q) => new Question(q.text, q.type, q.choices));
	let quiz = QuizService.generateQuiz(room.playersStillPlaying, challengeQuestions, unusedGeneralQuestions);
	expect(quiz.questions.length).toBe(MAX_NUM_QUESTIONS);
	expect(quiz.questions[quiz.questions.length - 1].text).toBe('Who is the mole?');
	expect(quiz.questions[quiz.questions.length - 1].type).toBe('player');
	expect(quiz.questions[quiz.questions.length - 1].choices.length).toBe(10);
});

test('Checks getFinalQuizQuestion method', () => {
	let room = RoomSampleService.getTestRoomWithTenPlayers();
	let finalQuestion = QuizService.getFinalQuizQuestion(room.playersStillPlaying);
	expect(finalQuestion.text).toBe('Who is the mole?');
	expect(finalQuestion.type).toBe('player');
	expect(finalQuestion.choices.length).toBe(10);

	expect(finalQuestion.choices[0]).toBe('test1');
	expect(finalQuestion.choices[1]).toBe('test2');
	expect(finalQuestion.choices[2]).toBe('test3');
	expect(finalQuestion.choices[3]).toBe('test4');
	expect(finalQuestion.choices[4]).toBe('test5');
	expect(finalQuestion.choices[5]).toBe('test6');
	expect(finalQuestion.choices[6]).toBe('test7');
	expect(finalQuestion.choices[7]).toBe('test8');
	expect(finalQuestion.choices[8]).toBe('test9');
	expect(finalQuestion.choices[9]).toBe('test0');
});

test('Checks createQuestion method', () => {
	let room = RoomSampleService.getTestRoomWithTenPlayers();

	//'player'
	let playerQuestion = QuizService.createQuestion(room.playersStillPlaying, 'Test text', 'player', []);
	expect(playerQuestion.text).toBe('Test text');
	expect(playerQuestion.type).toBe('player');
	expect(playerQuestion.choices.length).toBe(10);

	expect(playerQuestion.choices[0]).toBe('test1');
	expect(playerQuestion.choices[1]).toBe('test2');
	expect(playerQuestion.choices[2]).toBe('test3');
	expect(playerQuestion.choices[3]).toBe('test4');
	expect(playerQuestion.choices[4]).toBe('test5');
	expect(playerQuestion.choices[5]).toBe('test6');
	expect(playerQuestion.choices[6]).toBe('test7');
	expect(playerQuestion.choices[7]).toBe('test8');
	expect(playerQuestion.choices[8]).toBe('test9');
	expect(playerQuestion.choices[9]).toBe('test0');

	//'rank'
	let rankQuestion = QuizService.createQuestion(room.playersStillPlaying, 'Test text', 'rank', []);
	expect(rankQuestion.text).toBe('Test text');
	expect(rankQuestion.type).toBe('rank');
	expect(rankQuestion.choices.length).toBe(10);

	expect(rankQuestion.choices[0]).toBe('first');
	expect(rankQuestion.choices[1]).toBe('second');
	expect(rankQuestion.choices[2]).toBe('third');
	expect(rankQuestion.choices[3]).toBe('forth');
	expect(rankQuestion.choices[4]).toBe('fifth');
	expect(rankQuestion.choices[5]).toBe('sixth');
	expect(rankQuestion.choices[6]).toBe('seventh');
	expect(rankQuestion.choices[7]).toBe('eigth');
	expect(rankQuestion.choices[8]).toBe('nineth');
	expect(rankQuestion.choices[9]).toBe('tenth');

	// generic
	let question = QuizService.createQuestion(room.playersStillPlaying, 'Test text 2', '', [
		'north',
		'south',
		'east',
		'west'
	]);
	expect(question.text).toBe('Test text 2');
	expect(question.type).toBe('');
	expect(question.choices.length).toBe(4);

	expect(question.choices[0]).toBe('north');
	expect(question.choices[1]).toBe('south');
	expect(question.choices[2]).toBe('east');
	expect(question.choices[3]).toBe('west');
});
