import Player from '../models/player.model';
import Room, { IEpisodeGenerator, IMoleChooser } from '../models/room.model';
import RoomService from '../services/room/room.service';
import QuizAnswers from '../models/quiz/quiz-answers.model';
import Answer from '../models/quiz/quiz-answer.model';
import Quiz from '../models/quiz/quiz.model';
import QuizSampleService from '../services/sample/quiz.sample';
import { getMockRoomController } from '../services/sample/room-controller.sample';
import RoomController from '../controllers/room.controller';
import { getMockComponents } from '../services/sample/mock-components.service';

const ROOMCODE_REGEX = /[A-Z]{4}/;

let testRoom: Room = null;
let testRoomController: RoomController = null;
let testRoomCode: string = null;
describe('Room Controller Tests', () => {
	beforeEach(() => {
		let { roomcode, roomController } = getMockComponents(10);
		testRoomController = roomController;
		testRoomCode = roomcode;
		testRoom = testRoomController.getRoom(testRoomCode);
	});

	test('Checks "roomCodeAlreadyExists" method', () => {
		expect(testRoomController.roomCodeAlreadyExists(testRoomCode)).toBeTruthy();
		expect(testRoomController.roomCodeAlreadyExists('NOOP')).toBeFalsy();
	});

	test('Checks "generateRandomRoomCodeNotUsed" method', () => {
		let roomcode = testRoomController.generateRandomRoomCodeNotUsed();

		expect(ROOMCODE_REGEX.test(roomcode)).toBe(true);
		expect(RoomService.roomCodeIsABadWord(roomcode)).toBe(false);
		expect(roomcode !== 'TEST').toBe(true);
		expect(typeof testRoomController.getRoom(roomcode)).toBe('undefined');
	});

	test('Checks "addRoom" method', () => {
		let testRoomController = getMockRoomController();

		expect(Object.keys(testRoomController.rooms).length).toBe(0);

		testRoomController.addRoom('en');

		expect(Object.keys(testRoomController.rooms).length).toBe(1);

		testRoomController.deleteRoom(Object.keys(testRoomController.rooms)[0]);

		expect(Object.keys(testRoomController.rooms).length).toBe(0);
	});

	test('Checks getRoom/setRoom methods', () => {
		expect(typeof testRoomController.rooms[testRoomCode]).toBe('object');
		expect(testRoomController.rooms[testRoomCode].roomcode).toBe(testRoomCode);
		expect(typeof testRoomController.getRoom('TEST')).toBe('object');
		expect(testRoomController.getRoom('TEST').roomcode).toBe('TEST');
	});

	test('Checks "addPlayerToRoom" method', () => {
		let { roomcode, roomController } = getMockComponents(0);
		testRoomController = roomController;
		testRoomCode = roomcode;
		testRoom = testRoomController.getRoom(testRoomCode);

		// Init test
		expect(testRoomController.getRoom('TEST').playersStillPlaying.length).toBe(0);

		// Test adding first player
		testRoomController.addPlayerToRoom('TEST', new Player('test11'));

		expect(testRoomController.getRoom('TEST').playersStillPlaying.length).toBe(1);
		expect(testRoomController.getRoom('TEST').playersStillPlaying[0].name).toBe('test11');

		// Test trying to add the same player twice
		testRoomController.addPlayerToRoom('TEST', new Player('test11'));

		expect(testRoomController.getRoom('TEST').playersStillPlaying.length).toBe(1);
		expect(testRoomController.getRoom('TEST').playersStillPlaying[0].name).toBe('test11');

		// Test adding second player
		testRoomController.addPlayerToRoom('TEST', new Player('test12'));

		expect(testRoomController.getRoom('TEST').playersStillPlaying.length).toBe(2);
		expect(testRoomController.getRoom('TEST').playersStillPlaying[1].name).toBe('test12');
	});

	test('Checks "giveObjectsToPlayer/removeObjectsFromPlayer" methods', () => {
		let exemption = 'exemption';
		let joker = 'joker';
		let blackExemption = 'black-exemption';

		let player = testRoom.playersStillPlaying[0];

		testRoomController.giveObjectsToPlayer(testRoomCode, player.name, exemption, 2);
		expect(testRoomController.getRoom(testRoomCode).playersStillPlaying[0].objects[exemption]).toBe(2);
		expect(testRoomController.getRoom(testRoomCode).playersStillPlaying[0].objects[joker]).toBe(0);
		expect(testRoomController.getRoom(testRoomCode).playersStillPlaying[0].objects[blackExemption]).toBe(0);

		testRoomController.giveObjectsToPlayer(testRoomCode, player.name, joker, 2);
		expect(testRoomController.getRoom(testRoomCode).playersStillPlaying[0].objects[exemption]).toBe(2);
		expect(testRoomController.getRoom(testRoomCode).playersStillPlaying[0].objects[joker]).toBe(2);
		expect(testRoomController.getRoom(testRoomCode).playersStillPlaying[0].objects[blackExemption]).toBe(0);

		testRoomController.giveObjectsToPlayer(testRoomCode, player.name, blackExemption, 2);
		expect(testRoomController.getRoom(testRoomCode).playersStillPlaying[0].objects[exemption]).toBe(2);
		expect(testRoomController.getRoom(testRoomCode).playersStillPlaying[0].objects[joker]).toBe(2);
		expect(testRoomController.getRoom(testRoomCode).playersStillPlaying[0].objects[blackExemption]).toBe(2);

		testRoomController.removeObjectsFromPlayer(testRoomCode, player.name, exemption, 1);
		expect(testRoomController.getRoom(testRoomCode).playersStillPlaying[0].objects[exemption]).toBe(1);
		expect(testRoomController.getRoom(testRoomCode).playersStillPlaying[0].objects[joker]).toBe(2);
		expect(testRoomController.getRoom(testRoomCode).playersStillPlaying[0].objects[blackExemption]).toBe(2);

		testRoomController.removeObjectsFromPlayer(testRoomCode, player.name, joker, 2);
		expect(testRoomController.getRoom(testRoomCode).playersStillPlaying[0].objects[exemption]).toBe(1);
		expect(testRoomController.getRoom(testRoomCode).playersStillPlaying[0].objects[joker]).toBe(0);
		expect(testRoomController.getRoom(testRoomCode).playersStillPlaying[0].objects[blackExemption]).toBe(2);

		testRoomController.removeObjectsFromPlayer(testRoomCode, player.name, blackExemption, 3);
		expect(testRoomController.getRoom(testRoomCode).playersStillPlaying[0].objects[exemption]).toBe(1);
		expect(testRoomController.getRoom(testRoomCode).playersStillPlaying[0].objects[joker]).toBe(0);
		expect(testRoomController.getRoom(testRoomCode).playersStillPlaying[0].objects[blackExemption]).toBe(0);
	});

	test('Checks "addPoints/removePoints" methods', () => {
		expect(testRoomController.getRoom(testRoomCode).points).toBe(0);

		testRoomController.addPoints(testRoomCode);
		expect(testRoomController.getRoom(testRoomCode).points).toBe(1);

		testRoomController.addPoints(testRoomCode);
		expect(testRoomController.getRoom(testRoomCode).points).toBe(2);

		testRoomController.addPoints(testRoomCode, 1);
		expect(testRoomController.getRoom(testRoomCode).points).toBe(3);

		testRoomController.addPoints(testRoomCode, 3);
		expect(testRoomController.getRoom(testRoomCode).points).toBe(6);

		testRoomController.removePoints(testRoomCode);
		expect(testRoomController.getRoom(testRoomCode).points).toBe(5);

		testRoomController.removePoints(testRoomCode, 1);
		expect(testRoomController.getRoom(testRoomCode).points).toBe(4);

		testRoomController.removePoints(testRoomCode, 2);
		expect(testRoomController.getRoom(testRoomCode).points).toBe(2);

		testRoomController.removePoints(testRoomCode, 3);
		expect(testRoomController.getRoom(testRoomCode).points).toBe(0);
	});

	test('Checks "moveNext" method', () => {
		expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.LOBBY);

		testRoomController.moveNext(testRoomCode);

		expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.WELCOME);
	});

	test('Checks "quizDone" method', () => {
		let player1 = testRoom.playersStillPlaying[0];

		let question = {
			text: 'Test question text?',
			type: 'choice',
			choices: [ 'Yes', 'No' ]
		};
		let quiz: Quiz = { questions: [] };

		for (let i = 0; i < 20; i++) {
			quiz.questions.push(question);
		}

		let answers: Answer[] = quiz.questions.map((q) => new Answer(q, 1));

		let quizAnswers = new QuizAnswers(answers, 1);

		testRoom.generateCurrentEpisode();

		testRoom.state = Room.ROOM_STATES.IN_QUIZ;
		testRoomController.setRoom(testRoom);

		testRoomController.quizDone(testRoomCode, player1.name, quizAnswers);
		testRoom = testRoomController.getRoom(testRoomCode);

		expect(testRoom.currentEpisode.allPlayersFinishedQuiz).toBe(false);

		let episodePlayer = testRoom.currentEpisode.players.find((p) => p.player.name === player1.name);
		expect(episodePlayer).toBeTruthy();
		expect(episodePlayer.quizAnswers).toEqual(quizAnswers);
	});

	test('Checks "removePlayerFromRoom" method', () => {
		let player1Name = testRoom.playersStillPlaying[0].name;

		expect(testRoom.playersStillPlaying).toHaveLength(10);
		expect(testRoom.playersStillPlaying.find((p) => p.name === player1Name)).toBeTruthy();

		testRoomController.removePlayerFromRoom(testRoomCode, player1Name);

		expect(testRoom.playersStillPlaying).toHaveLength(9);
		expect(testRoom.playersStillPlaying.find((p) => p.name === player1Name)).toBeFalsy();
	});

	test('Runs scenario where all players have given in quiz answers and checks against mole player (no ties)', () => {
		let { roomcode, roomController } = getMockComponents(4);
		testRoomController = roomController;
		testRoomCode = roomcode;
		testRoom = testRoomController.getRoom(testRoomCode);

		testRoomController.moveNext(testRoomCode);
		testRoomController.moveNext(testRoomCode);
		testRoomController.moveNext(testRoomCode);
		testRoomController.endChallenge(testRoomCode);
		testRoomController.moveNext(testRoomCode);
		testRoomController.moveNext(testRoomCode);

		testRoom = testRoomController.getRoom(testRoomCode);

		let quiz = QuizSampleService.getTestQuiz();
		let moleQuizAnswers = QuizSampleService.getMoleQuizAnswers(quiz);
		let perfectAnswers = QuizSampleService.getPerfectQuizAnswers(moleQuizAnswers, 1);
		let goodAnswers = QuizSampleService.getGoodQuizAnswers(moleQuizAnswers, 1);
		let losingAnswers = QuizSampleService.getLoserQuizAnswers(moleQuizAnswers, 1);

		expect(testRoom.currentEpisode.allPlayersFinishedQuiz).toBeFalsy();

		testRoomController.quizDone(testRoomCode, testRoom.playersStillPlaying[0].name, moleQuizAnswers);
		testRoomController.quizDone(testRoomCode, testRoom.playersStillPlaying[1].name, perfectAnswers);
		testRoomController.quizDone(testRoomCode, testRoom.playersStillPlaying[2].name, goodAnswers);
		testRoomController.quizDone(testRoomCode, testRoom.playersStillPlaying[3].name, losingAnswers);
		testRoom = testRoomController.getRoom(testRoomCode);

		expect(testRoom.currentEpisode.allPlayersFinishedQuiz).toBeTruthy();

		let eliminatedPlayer = testRoom.currentEpisode.eliminatedPlayer;
		let molePlayer = testRoom.playersStillPlaying[0];

		expect(eliminatedPlayer).toBeTruthy();
		expect(molePlayer).toBeTruthy();
		expect(molePlayer.name !== eliminatedPlayer.name).toBeTruthy();
		expect(testRoom.playersStillPlaying[3].name === eliminatedPlayer.name).toBeTruthy();
	});
});
