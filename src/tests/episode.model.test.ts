import Episode from '../models/episode.model';
import Room, { IEpisodeGenerator, IMoleChooser } from '../models/room.model';
import QuizSampleService from '../services/sample/quiz.sample';
import ChallengeData from '../interfaces/challenge-data';
import { getMockRoomControllerWithRoom } from '../services/sample/room-controller.sample';
import Player from '../models/player.model';
import Question from '../models/quiz/question.model';
import ChallengeService from '../services/game/challenge.service';
import ChallengeSampleService from '../services/sample/challenge.sample';
import RoomController from '../controllers/room.controller';

const NUMBER_OF_PLAYERS = 5;

function getMockComponents() {
	const room = new Room('TEST', 'en', new MoleChooser(), new EpisodeGenerator());

	room.addPlayer(new Player('test1'));
	room.addPlayer(new Player('test2'));
	room.addPlayer(new Player('test3'));
	room.addPlayer(new Player('test4'));
	room.addPlayer(new Player('test5'));

	room.chooseMole();

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

let testRoom: Room = null;
let testRoomController: RoomController = null;
let testEpisode: Episode = null;

beforeEach(() => {
	let { room, roomController } = getMockComponents();
	testRoom = room;
	testRoomController = roomController;
	testRoomController.moveNext(testRoom.roomcode);
	testRoomController.moveNext(testRoom.roomcode);
	testRoomController.moveNext(testRoom.roomcode);
	testRoom = testRoomController.getRoom(testRoom.roomcode);
	testEpisode = testRoom.currentEpisode;
});

test('Tests episode init', () => {
	expect(testEpisode.currentChallengeIndex).toBe(0);
	expect(testEpisode.players.length).toEqual(NUMBER_OF_PLAYERS);
});

test('Tests getter and setters', () => {
	expect(testEpisode.episodeIsOver).toBeFalsy();
	expect(testEpisode.molePlayer.player.isMole).toBeTruthy();
	expect(testEpisode.eliminatedPlayer).toBeFalsy();
	expect(testEpisode.allPlayersFinishedQuiz).toBeFalsy();

	testEpisode.goToNextChallenge();
	testEpisode.goToNextChallenge();
	testEpisode.goToNextChallenge();

	testRoomController.endChallenge(testRoom.roomcode);

	expect(testEpisode.episodeIsOver).toBeTruthy();
});

test('Tests setQuizResultsForPlayer', () => {
	let quiz = QuizSampleService.getTestQuiz();
	let moleQuizAnswers = QuizSampleService.getMoleQuizAnswers(quiz);
	let greatQuizAnswers = QuizSampleService.getGreatQuizAnswers(moleQuizAnswers, 1);

	testEpisode.setQuizResultsForPlayer(testEpisode.players[0].player.name, greatQuizAnswers);

	expect(testEpisode.players[0].quizAnswers).toEqual(greatQuizAnswers);
});

test('Tests eliminatedPlayer getter (all players have same time)', () => {
	testEpisode.goToNextChallenge();
	testEpisode.goToNextChallenge();
	testEpisode.goToNextChallenge();

	testRoomController.endChallenge(testRoom.roomcode);

	let quiz = QuizSampleService.getTestQuiz();
	let moleQuizAnswers = QuizSampleService.getMoleQuizAnswers(quiz);
	let greatQuizAnswers = QuizSampleService.getGreatQuizAnswers(moleQuizAnswers, 1);
	let goodQuizAnswers = QuizSampleService.getGoodQuizAnswers(moleQuizAnswers, 1);
	let badQuizAnswers = QuizSampleService.getBadQuizAnswers(moleQuizAnswers, 1);
	let loserQuizAnswers = QuizSampleService.getLoserQuizAnswers(moleQuizAnswers, 1);

	expect(testEpisode.allPlayersFinishedQuiz).toBeFalsy();

	// It's assumed that player[0] is the mole
	testEpisode.setQuizResultsForPlayer(testEpisode.players[0].player.name, moleQuizAnswers);
	testEpisode.setQuizResultsForPlayer(testEpisode.players[1].player.name, greatQuizAnswers);
	testEpisode.setQuizResultsForPlayer(testEpisode.players[2].player.name, goodQuizAnswers);
	testEpisode.setQuizResultsForPlayer(testEpisode.players[3].player.name, badQuizAnswers);
	testEpisode.setQuizResultsForPlayer(testEpisode.players[4].player.name, loserQuizAnswers);

	expect(testEpisode.allPlayersFinishedQuiz).toBeTruthy();

	const { eliminatedPlayer } = testEpisode;

	expect(eliminatedPlayer).toBeTruthy();
	expect(eliminatedPlayer.name).toBe(testEpisode.players[4].player.name);
});

test('Tests eliminatedPlayer getter (all players have same quiz answers)', () => {
	testEpisode.goToNextChallenge();
	testEpisode.goToNextChallenge();
	testEpisode.goToNextChallenge();

	testRoomController.endChallenge(testRoom.roomcode);

	let quiz = QuizSampleService.getTestQuiz();
	let moleQuizAnswers = QuizSampleService.getMoleQuizAnswers(quiz);
	let greatQuizAnswers1 = QuizSampleService.getGreatQuizAnswers(moleQuizAnswers, 1);
	let greatQuizAnswers2 = QuizSampleService.getGreatQuizAnswers(moleQuizAnswers, 2);
	let greatQuizAnswers3 = QuizSampleService.getGreatQuizAnswers(moleQuizAnswers, 3);
	let greatQuizAnswers4 = QuizSampleService.getGreatQuizAnswers(moleQuizAnswers, 4);

	// It's assumed that player[0] is the mole
	testEpisode.setQuizResultsForPlayer(testEpisode.players[0].player.name, moleQuizAnswers);
	testEpisode.setQuizResultsForPlayer(testEpisode.players[1].player.name, greatQuizAnswers1);
	testEpisode.setQuizResultsForPlayer(testEpisode.players[2].player.name, greatQuizAnswers2);
	testEpisode.setQuizResultsForPlayer(testEpisode.players[3].player.name, greatQuizAnswers3);
	testEpisode.setQuizResultsForPlayer(testEpisode.players[4].player.name, greatQuizAnswers4);

	expect(testEpisode.allPlayersFinishedQuiz).toBeTruthy();

	let eliminatedPlayer = testEpisode.eliminatedPlayer;

	expect(eliminatedPlayer.name).toBe(testEpisode.players[4].player.name);
});

test("Tests eliminatedPlayer getter (everyone is tied but doesn't matter as one player loses)", () => {
	testEpisode.goToNextChallenge();
	testEpisode.goToNextChallenge();
	testEpisode.goToNextChallenge();

	testRoomController.endChallenge(testRoom.roomcode);

	let quiz = QuizSampleService.getTestQuiz();
	let moleQuizAnswers = QuizSampleService.getMoleQuizAnswers(quiz);
	let greatQuizAnswers1 = QuizSampleService.getGreatQuizAnswers(moleQuizAnswers, 3);
	let greatQuizAnswers2 = QuizSampleService.getGreatQuizAnswers(moleQuizAnswers, 3);
	let greatQuizAnswers3 = QuizSampleService.getGreatQuizAnswers(moleQuizAnswers, 3);
	let loserQuizAnswers = QuizSampleService.getLoserQuizAnswers(moleQuizAnswers, 1);

	// It's assumed that player[0] is the mole
	testEpisode.setQuizResultsForPlayer(testEpisode.players[0].player.name, moleQuizAnswers);
	testEpisode.setQuizResultsForPlayer(testEpisode.players[1].player.name, greatQuizAnswers1);
	testEpisode.setQuizResultsForPlayer(testEpisode.players[2].player.name, greatQuizAnswers2);
	testEpisode.setQuizResultsForPlayer(testEpisode.players[3].player.name, greatQuizAnswers3);
	testEpisode.setQuizResultsForPlayer(testEpisode.players[4].player.name, loserQuizAnswers);

	expect(testEpisode.allPlayersFinishedQuiz).toBeTruthy();

	let eliminatedPlayer = testEpisode.eliminatedPlayer;

	expect(eliminatedPlayer.name).toBe(testEpisode.players[4].player.name);
});

test.skip('Tests eliminatedPlayer getter (two players have identical low scores)', () => {
	testEpisode.goToNextChallenge();
	testEpisode.goToNextChallenge();
	testEpisode.goToNextChallenge();

	testRoomController.endChallenge(testRoom.roomcode);

	let quiz = QuizSampleService.getTestQuiz();
	let moleQuizAnswers = QuizSampleService.getMoleQuizAnswers(quiz);
	let loserQuizAnswers = QuizSampleService.getLoserQuizAnswers(moleQuizAnswers, 1);

	// It's assumed that player[0] is the mole
	testEpisode.setQuizResultsForPlayer(testEpisode.players[0].player.name, moleQuizAnswers);
	testEpisode.setQuizResultsForPlayer(testEpisode.players[1].player.name, loserQuizAnswers);
	testEpisode.setQuizResultsForPlayer(testEpisode.players[2].player.name, loserQuizAnswers);
	testEpisode.setQuizResultsForPlayer(testEpisode.players[3].player.name, loserQuizAnswers);
	testEpisode.setQuizResultsForPlayer(testEpisode.players[4].player.name, loserQuizAnswers);

	expect(testEpisode.allPlayersFinishedQuiz).toBeTruthy();

	let eliminatedPlayer = testEpisode.eliminatedPlayer;

	expect(eliminatedPlayer.name).toBe(testEpisode.players[4].player.name);
});

test('Tests allPlayersFinishedQuiz getter', () => {});
