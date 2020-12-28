import Player from '../models/player.model';
import Room from '../models/room.model';
import RoomService from '../services/room/room.service';
import RoomSampleService from '../services/sample/room.sample';
import EpisodeSampleService from '../services/sample/episode.sample';
import QuizAnswers from '../models/quiz/quiz-answers.model';
import Answer from '../models/quiz/quiz-answer.model';
import Quiz from '../models/quiz/quiz.model';
import QuizSampleService from '../services/sample/quiz.sample';
import { getMockRoomController, getMockRoomControllerWithRoom } from '../services/sample/room-controller.sample';

const ROOMCODE_REGEX = /[A-Z]{4}/;

function getMockRoom(numPlayers) {
	let room = RoomSampleService.getTestRoomForNumPlayers(numPlayers);
	room.chooseMole();
	room.currentEpisode = EpisodeSampleService.getTestEpisode(room.playersStillPlaying);
	return room;
}

function getMockComponents(numPlayers) {
	let room = getMockRoom(numPlayers);
	let roomController = getMockRoomControllerWithRoom(room);

	return { room, roomController };
}

test('Checks "roomCodeAlreadyExists" method', () => {
	let { room, roomController } = getMockComponents(10);

	expect(roomController.roomCodeAlreadyExists(room.roomcode)).toBe(true);
	expect(roomController.roomCodeAlreadyExists('NOOP')).toBe(false);
});

test('Checks "generateRandomRoomCodeNotUsed" method', () => {
	let { room, roomController } = getMockComponents(10);

	let roomcode = roomController.generateRandomRoomCodeNotUsed();

	expect(ROOMCODE_REGEX.test(roomcode)).toBe(true);
	expect(RoomService.roomCodeIsABadWord(roomcode)).toBe(false);
	expect(roomcode !== 'TEST').toBe(true);
	expect(typeof roomController.getRoom(roomcode)).toBe('undefined');
});

test('Checks "addRoom" method', () => {
	let roomController = getMockRoomController();

	expect(Object.keys(roomController.rooms).length).toBe(0);

	roomController.addRoom('en');

	expect(Object.keys(roomController.rooms).length).toBe(1);

	roomController.deleteRoom(Object.keys(roomController.rooms)[0]);

	expect(Object.keys(roomController.rooms).length).toBe(0);
});

test('Checks getRoom/setRoom methods', () => {
	let { room, roomController } = getMockComponents(10);
	let { roomcode } = room;

	expect(typeof roomController.rooms[roomcode]).toBe('object');
	expect(roomController.rooms[roomcode].roomcode).toBe(roomcode);
	expect(typeof roomController.getRoom('TEST')).toBe('object');
	expect(roomController.getRoom('TEST').roomcode).toBe('TEST');
});

test('Checks "addPlayerToRoom" method', () => {
	let { room, roomController } = getMockComponents(0);

	// Init test
	expect(roomController.getRoom('TEST').playersStillPlaying.length).toBe(0);

	// Test adding first player
	roomController.addPlayerToRoom('TEST', new Player('test11'));

	expect(roomController.getRoom('TEST').playersStillPlaying.length).toBe(1);
	expect(roomController.getRoom('TEST').playersStillPlaying[0].name).toBe('test11');

	// Test trying to add the same player twice
	roomController.addPlayerToRoom('TEST', new Player('test11'));

	expect(roomController.getRoom('TEST').playersStillPlaying.length).toBe(1);
	expect(roomController.getRoom('TEST').playersStillPlaying[0].name).toBe('test11');

	// Test adding second player
	roomController.addPlayerToRoom('TEST', new Player('test12'));

	expect(roomController.getRoom('TEST').playersStillPlaying.length).toBe(2);
	expect(roomController.getRoom('TEST').playersStillPlaying[1].name).toBe('test12');
});

test('Checks "removePlayerToRoom" method', () => {}); //TODO

test('Checks "giveObjectsToPlayer/removeObjectsFromPlayer" methods', () => {
	let { room, roomController } = getMockComponents(10);
	let { roomcode } = room;
	let exemption = 'exemption';
	let joker = 'joker';
	let blackExemption = 'black-exemption';

	let player = room.playersStillPlaying[0];

	roomController.giveObjectsToPlayer(roomcode, player.name, exemption, 2);
	expect(roomController.getRoom(roomcode).playersStillPlaying[0].objects[exemption]).toBe(2);
	expect(roomController.getRoom(roomcode).playersStillPlaying[0].objects[joker]).toBe(0);
	expect(roomController.getRoom(roomcode).playersStillPlaying[0].objects[blackExemption]).toBe(0);

	roomController.giveObjectsToPlayer(roomcode, player.name, joker, 2);
	expect(roomController.getRoom(roomcode).playersStillPlaying[0].objects[exemption]).toBe(2);
	expect(roomController.getRoom(roomcode).playersStillPlaying[0].objects[joker]).toBe(2);
	expect(roomController.getRoom(roomcode).playersStillPlaying[0].objects[blackExemption]).toBe(0);

	roomController.giveObjectsToPlayer(roomcode, player.name, blackExemption, 2);
	expect(roomController.getRoom(roomcode).playersStillPlaying[0].objects[exemption]).toBe(2);
	expect(roomController.getRoom(roomcode).playersStillPlaying[0].objects[joker]).toBe(2);
	expect(roomController.getRoom(roomcode).playersStillPlaying[0].objects[blackExemption]).toBe(2);

	roomController.removeObjectsFromPlayer(roomcode, player.name, exemption, 1);
	expect(roomController.getRoom(roomcode).playersStillPlaying[0].objects[exemption]).toBe(1);
	expect(roomController.getRoom(roomcode).playersStillPlaying[0].objects[joker]).toBe(2);
	expect(roomController.getRoom(roomcode).playersStillPlaying[0].objects[blackExemption]).toBe(2);

	roomController.removeObjectsFromPlayer(roomcode, player.name, joker, 2);
	expect(roomController.getRoom(roomcode).playersStillPlaying[0].objects[exemption]).toBe(1);
	expect(roomController.getRoom(roomcode).playersStillPlaying[0].objects[joker]).toBe(0);
	expect(roomController.getRoom(roomcode).playersStillPlaying[0].objects[blackExemption]).toBe(2);

	roomController.removeObjectsFromPlayer(roomcode, player.name, blackExemption, 3);
	expect(roomController.getRoom(roomcode).playersStillPlaying[0].objects[exemption]).toBe(1);
	expect(roomController.getRoom(roomcode).playersStillPlaying[0].objects[joker]).toBe(0);
	expect(roomController.getRoom(roomcode).playersStillPlaying[0].objects[blackExemption]).toBe(0);
});

test('Checks "addPoints/removePoints" methods', () => {
	let { room, roomController } = getMockComponents(10);
	let { roomcode } = room;

	expect(roomController.getRoom(roomcode).points).toBe(0);

	roomController.addPoints(roomcode);
	expect(roomController.getRoom(roomcode).points).toBe(1);

	roomController.addPoints(roomcode);
	expect(roomController.getRoom(roomcode).points).toBe(2);

	roomController.addPoints(roomcode, 1);
	expect(roomController.getRoom(roomcode).points).toBe(3);

	roomController.addPoints(roomcode, 3);
	expect(roomController.getRoom(roomcode).points).toBe(6);

	roomController.removePoints(roomcode);
	expect(roomController.getRoom(roomcode).points).toBe(5);

	roomController.removePoints(roomcode, 1);
	expect(roomController.getRoom(roomcode).points).toBe(4);

	roomController.removePoints(roomcode, 2);
	expect(roomController.getRoom(roomcode).points).toBe(2);

	roomController.removePoints(roomcode, 3);
	expect(roomController.getRoom(roomcode).points).toBe(0);
});

test('Checks "moveNext" method', () => {
	let { room, roomController } = getMockComponents(10);
	let { roomcode } = room;

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.LOBBY);

	roomController.moveNext(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.WELCOME);
});

test('Checks "quizDone" method', () => {
	let { room, roomController } = getMockComponents(10);
	let { roomcode } = room;
	let player1 = room.playersStillPlaying[0];

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

	roomController.quizDone(roomcode, player1.name, quizAnswers);
	room = roomController.getRoom(roomcode);

	expect(room.currentEpisode.allPlayersFinishedQuiz).toBe(false);

	let episodePlayer = room.currentEpisode.players.find((p) => p.player.name === player1.name);
	expect(episodePlayer).toBeTruthy();
	expect(episodePlayer.quizAnswers).toEqual(quizAnswers);
});

test('Checks "removePlayerFromRoom" method', () => {
	let { room, roomController } = getMockComponents(10);
	let { roomcode } = room;
	let player1Name = room.playersStillPlaying[0].name;

	expect(room.playersStillPlaying).toHaveLength(10);
	expect(room.playersStillPlaying.find((p) => p.name === player1Name)).toBeTruthy();

	roomController.removePlayerFromRoom(roomcode, player1Name);

	expect(room.playersStillPlaying).toHaveLength(9);
	expect(room.playersStillPlaying.find((p) => p.name === player1Name)).toBeFalsy();
});

test('Runs scenario where all players have given in quiz answers and checks against mole player (no ties)', () => {
	let { room, roomController } = getMockComponents(4);
	let { roomcode } = room;

	room.currentEpisode.goToNextChallenge();
	roomController.setRoom(room);

	let quiz = QuizSampleService.getTestQuiz();
	let moleQuizAnswers = QuizSampleService.getMoleQuizAnswers(quiz);
	let perfectAnswers = QuizSampleService.getPerfectQuizAnswers(moleQuizAnswers, 1);
	let goodAnswers = QuizSampleService.getGoodQuizAnswers(moleQuizAnswers, 1);
	let losingAnswers = QuizSampleService.getLoserQuizAnswers(moleQuizAnswers, 1);

	expect(room.currentEpisode.allPlayersFinishedQuiz).toBeFalsy();

	roomController.quizDone(roomcode, room.playersStillPlaying[0].name, moleQuizAnswers);
	roomController.quizDone(roomcode, room.playersStillPlaying[1].name, perfectAnswers);
	roomController.quizDone(roomcode, room.playersStillPlaying[2].name, goodAnswers);
	roomController.quizDone(roomcode, room.playersStillPlaying[3].name, losingAnswers);

	expect(room.currentEpisode.allPlayersFinishedQuiz).toBeTruthy();

	let eliminatedPlayer = room.currentEpisode.eliminatedPlayer;
	let molePlayer = room.playersStillPlaying[0];

	expect(eliminatedPlayer).toBeTruthy();
	expect(molePlayer).toBeTruthy();
	expect(molePlayer.name !== eliminatedPlayer.name).toBeTruthy();
	expect(room.playersStillPlaying[3].name === eliminatedPlayer.name).toBeTruthy();
});
