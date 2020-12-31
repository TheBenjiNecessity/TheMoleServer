import Player from '../models/player.model';
import Room, { IEpisodeGenerator, IMoleChooser } from '../models/room.model';
import RoomService from '../services/room/room.service';
import RoomSampleService from '../services/sample/room.sample';
import EpisodeSampleService from '../services/sample/episode.sample';
import QuizAnswers from '../models/quiz/quiz-answers.model';
import Answer from '../models/quiz/quiz-answer.model';
import Quiz from '../models/quiz/quiz.model';
import QuizSampleService from '../services/sample/quiz.sample';
import { getMockRoomController, getMockRoomControllerWithRoom } from '../services/sample/room-controller.sample';
import ChallengeSampleService from '../services/sample/challenge.sample';
import ChallengeData from '../interfaces/challenge-data';
import Question from '../models/quiz/question.model';
import Episode from '../models/episode.model';
import ChallengeService from '../services/game/challenge.service';

const ROOMCODE_REGEX = /[A-Z]{4}/;

function getMockComponents(numPlayers: number) {
	const room = new Room('TEST', 'en', new MoleChooser(), new EpisodeGenerator());

	for (let i = 0; i < numPlayers; i++) {
		room.addPlayer(new Player('test' + (numPlayers + 1)));
	}

	const withRoles = new Array(30).fill(false);
	withRoles[0] = true;
	const challengeData = ChallengeSampleService.getTestChallengeData(room.playersStillPlaying, withRoles);
	const roomController = getMockRoomControllerWithRoom(room, challengeData);

	return { room, roomController };
}

class MoleChooser implements IMoleChooser {
	constructor() {}

	getMoleIndex(players: Player[]) {
		return 0;
	}
}

class EpisodeGenerator implements IEpisodeGenerator {
	constructor() {}

	generateCurrentEpisode(
		numChallenges: number,
		playersStillPlaying: Player[],
		unusedChallenges: ChallengeData[],
		unaskedQuestions: Question[],
		language: string
	): Episode {
		let challenges = [];

		for (let i = 0; i < numChallenges; i++) {
			let numRestrictedChallenges = ChallengeService.listChallengesForNumPlayers(
				playersStillPlaying.length,
				unusedChallenges,
				challenges
			);

			if (numRestrictedChallenges.length <= 0) {
				continue;
			}

			const tempChallengeData = numRestrictedChallenges[0];
			tempChallengeData.initModel(playersStillPlaying, 'en');
			challenges.push(tempChallengeData);
		}

		return new Episode(playersStillPlaying, challenges, QuizSampleService.getQuestionList(10));
	}
}

describe('Room Controller Tests', () => {
	test('Checks "roomCodeAlreadyExists" method', () => {
		let { room, roomController } = getMockComponents(10);

		expect(roomController.roomCodeAlreadyExists(room.roomcode)).toBeTruthy();
		expect(roomController.roomCodeAlreadyExists('NOOP')).toBeFalsy();
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

	test.only('Checks "quizDone" method', () => {
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

		room.state = Room.ROOM_STATES.IN_QUIZ;
		roomController.setRoom(room);

		roomController.quizDone(roomcode, player1.name, quizAnswers);
		room = roomController.getRoom(roomcode);

		console.log('currentEpisode', room.currentEpisode);

		expect(room.currentEpisode.allPlayersFinishedQuiz).toBe(false);

		let episodePlayer = room.currentEpisode.players.find((p) => p.player.name === player1.name);
		console.log('episodePlayer', episodePlayer);
		console.log('quizAnswers', quizAnswers);
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

		roomController.moveNext(roomcode);
		roomController.moveNext(roomcode);
		roomController.moveNext(roomcode);
		roomController.endChallenge(roomcode);
		roomController.moveNext(roomcode);
		roomController.endChallenge(roomcode);
		roomController.moveNext(roomcode);
		roomController.endChallenge(roomcode);
		roomController.moveNext(roomcode);
		roomController.endChallenge(roomcode);
		roomController.moveNext(roomcode);

		room = roomController.getRoom(roomcode);

		let quiz = QuizSampleService.getTestQuiz();
		let moleQuizAnswers = QuizSampleService.getMoleQuizAnswers(quiz);
		let perfectAnswers = QuizSampleService.getPerfectQuizAnswers(moleQuizAnswers, 1);
		let goodAnswers = QuizSampleService.getGoodQuizAnswers(moleQuizAnswers, 1);
		let losingAnswers = QuizSampleService.getLoserQuizAnswers(moleQuizAnswers, 1);

		//console.log('allPlayersFinishedQuiz1', room.currentEpisode.allPlayersFinishedQuiz);
		expect(room.currentEpisode.allPlayersFinishedQuiz).toBeFalsy();

		roomController.quizDone(roomcode, room.playersStillPlaying[0].name, moleQuizAnswers);
		roomController.quizDone(roomcode, room.playersStillPlaying[1].name, perfectAnswers);
		roomController.quizDone(roomcode, room.playersStillPlaying[2].name, goodAnswers);
		roomController.quizDone(roomcode, room.playersStillPlaying[3].name, losingAnswers);
		//console.log('allPlayersFinishedQuiz2', room.currentEpisode.allPlayersFinishedQuiz);
		expect(room.currentEpisode.allPlayersFinishedQuiz).toBeTruthy();

		let eliminatedPlayer = room.currentEpisode.eliminatedPlayer;
		let molePlayer = room.playersStillPlaying[0];

		expect(eliminatedPlayer).toBeTruthy();
		expect(molePlayer).toBeTruthy();
		expect(molePlayer.name !== eliminatedPlayer.name).toBeTruthy();
		expect(room.playersStillPlaying[3].name === eliminatedPlayer.name).toBeTruthy();
	});
});
