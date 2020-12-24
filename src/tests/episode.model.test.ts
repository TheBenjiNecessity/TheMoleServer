import Episode from '../models/episode.model';
import Room from '../models/room.model';
import RoomSampleService from '../services/sample/room.sample';
import questionData from '../models/quiz/question.data';
import QuizSampleService from '../services/sample/quiz.sample';
import ChallengeData from '../interfaces/challenge-data';
import ButtonChallengeData from '../challenges/button/data';

const NUMBER_OF_PLAYERS = 5;

function getMockRoom() {
	return RoomSampleService.getTestRoomForNumPlayers(NUMBER_OF_PLAYERS);
}

function getMockChallenge(room) {
	const buttonChallengeData = new ButtonChallengeData();
	buttonChallengeData.initModel(room.playersStillPlaying, 'en');
	return buttonChallengeData;
}

function getMockEpisode(room: Room, challengeData: ChallengeData) {
	return new Episode(room.playersStillPlaying, [ challengeData ], questionData['en']);
}

function getMockComponents() {
	let room = getMockRoom();
	let challengeData = getMockChallenge(room);
	let episode = getMockEpisode(room, challengeData);
	room.currentEpisode = episode;

	return { room, challengeData, episode };
}

test('Tests episode init', () => {
	let { episode } = getMockComponents();

	expect(episode.currentChallengeIndex).toBe(0);
	expect(episode.players.length).toEqual(NUMBER_OF_PLAYERS);
});

test('Tests getter and setters', () => {
	let { challengeData, episode } = getMockComponents();

	expect(episode.currentChallenge).toEqual(challengeData.model);
	expect(episode.episodeIsOver).toEqual(false);
	expect(episode.molePlayer.player.isMole).toBeTruthy();
	expect(episode.eliminatedPlayer).toBeFalsy();
	expect(episode.allPlayersFinishedQuiz).toBeFalsy();

	episode.goToNextChallenge();

	expect(episode.episodeIsOver).toBeTruthy();
});

test('Tests setQuizResultsForPlayer', () => {
	let { episode } = getMockComponents();

	let quiz = QuizSampleService.getTestQuiz();
	let moleQuizAnswers = QuizSampleService.getMoleQuizAnswers(quiz);
	let greatQuizAnswers = QuizSampleService.getGreatQuizAnswers(moleQuizAnswers, 1);

	episode.setQuizResultsForPlayer(episode.players[0].player.name, greatQuizAnswers);

	expect(episode.players[0].quizAnswers).toEqual(greatQuizAnswers);
});

test('Tests eliminatedPlayer getter (all players have same time)', () => {
	let { episode } = getMockComponents();
	episode.goToNextChallenge();

	let quiz = QuizSampleService.getTestQuiz();
	let moleQuizAnswers = QuizSampleService.getMoleQuizAnswers(quiz);
	let greatQuizAnswers = QuizSampleService.getGreatQuizAnswers(moleQuizAnswers, 1);
	let goodQuizAnswers = QuizSampleService.getGoodQuizAnswers(moleQuizAnswers, 1);
	let badQuizAnswers = QuizSampleService.getBadQuizAnswers(moleQuizAnswers, 1);
	let loserQuizAnswers = QuizSampleService.getLoserQuizAnswers(moleQuizAnswers, 1);

	expect(episode.allPlayersFinishedQuiz).toBeFalsy();

	// It's assumed that player[0] is the mole
	episode.setQuizResultsForPlayer(episode.players[0].player.name, moleQuizAnswers);
	episode.setQuizResultsForPlayer(episode.players[1].player.name, greatQuizAnswers);
	episode.setQuizResultsForPlayer(episode.players[2].player.name, goodQuizAnswers);
	episode.setQuizResultsForPlayer(episode.players[3].player.name, badQuizAnswers);
	episode.setQuizResultsForPlayer(episode.players[4].player.name, loserQuizAnswers);

	expect(episode.allPlayersFinishedQuiz).toBeTruthy();

	const { eliminatedPlayer } = episode;

	expect(eliminatedPlayer).toBeTruthy();
	expect(eliminatedPlayer.name).toBe(episode.players[4].player.name);
});

test('Tests eliminatedPlayer getter (all players have same quiz answers)', () => {
	let { episode } = getMockComponents();
	episode.goToNextChallenge();

	let quiz = QuizSampleService.getTestQuiz();
	let moleQuizAnswers = QuizSampleService.getMoleQuizAnswers(quiz);
	let greatQuizAnswers1 = QuizSampleService.getGreatQuizAnswers(moleQuizAnswers, 1);
	let greatQuizAnswers2 = QuizSampleService.getGreatQuizAnswers(moleQuizAnswers, 2);
	let greatQuizAnswers3 = QuizSampleService.getGreatQuizAnswers(moleQuizAnswers, 3);
	let greatQuizAnswers4 = QuizSampleService.getGreatQuizAnswers(moleQuizAnswers, 4);

	// It's assumed that player[0] is the mole
	episode.setQuizResultsForPlayer(episode.players[0].player.name, moleQuizAnswers);
	episode.setQuizResultsForPlayer(episode.players[1].player.name, greatQuizAnswers1);
	episode.setQuizResultsForPlayer(episode.players[2].player.name, greatQuizAnswers2);
	episode.setQuizResultsForPlayer(episode.players[3].player.name, greatQuizAnswers3);
	episode.setQuizResultsForPlayer(episode.players[4].player.name, greatQuizAnswers4);

	expect(episode.allPlayersFinishedQuiz).toBeTruthy();

	let eliminatedPlayer = episode.eliminatedPlayer;

	expect(eliminatedPlayer.name).toBe(episode.players[4].player.name);
});

test("Tests eliminatedPlayer getter (everyone is tied but doesn't matter as one player loses)", () => {
	let { episode } = getMockComponents();
	episode.goToNextChallenge();

	let quiz = QuizSampleService.getTestQuiz();
	let moleQuizAnswers = QuizSampleService.getMoleQuizAnswers(quiz);
	let greatQuizAnswers1 = QuizSampleService.getGreatQuizAnswers(moleQuizAnswers, 3);
	let greatQuizAnswers2 = QuizSampleService.getGreatQuizAnswers(moleQuizAnswers, 3);
	let greatQuizAnswers3 = QuizSampleService.getGreatQuizAnswers(moleQuizAnswers, 3);
	let loserQuizAnswers = QuizSampleService.getLoserQuizAnswers(moleQuizAnswers, 1);

	// It's assumed that player[0] is the mole
	episode.setQuizResultsForPlayer(episode.players[0].player.name, moleQuizAnswers);
	episode.setQuizResultsForPlayer(episode.players[1].player.name, greatQuizAnswers1);
	episode.setQuizResultsForPlayer(episode.players[2].player.name, greatQuizAnswers2);
	episode.setQuizResultsForPlayer(episode.players[3].player.name, greatQuizAnswers3);
	episode.setQuizResultsForPlayer(episode.players[4].player.name, loserQuizAnswers);

	expect(episode.allPlayersFinishedQuiz).toBeTruthy();

	let eliminatedPlayer = episode.eliminatedPlayer;

	expect(eliminatedPlayer.name).toBe(episode.players[4].player.name);
});

test.skip('Tests eliminatedPlayer getter (two players have identical low scores)', () => {
	let { episode } = getMockComponents();
	episode.goToNextChallenge();

	let quiz = QuizSampleService.getTestQuiz();
	let moleQuizAnswers = QuizSampleService.getMoleQuizAnswers(quiz);
	let loserQuizAnswers = QuizSampleService.getLoserQuizAnswers(moleQuizAnswers, 1);

	// It's assumed that player[0] is the mole
	episode.setQuizResultsForPlayer(episode.players[0].player.name, moleQuizAnswers);
	episode.setQuizResultsForPlayer(episode.players[1].player.name, loserQuizAnswers);
	episode.setQuizResultsForPlayer(episode.players[2].player.name, loserQuizAnswers);
	episode.setQuizResultsForPlayer(episode.players[3].player.name, loserQuizAnswers);
	episode.setQuizResultsForPlayer(episode.players[4].player.name, loserQuizAnswers);

	expect(episode.allPlayersFinishedQuiz).toBeTruthy();

	let eliminatedPlayer = episode.eliminatedPlayer;

	expect(eliminatedPlayer.name).toBe(episode.players[4].player.name);
});

test('Tests allPlayersFinishedQuiz getter', () => {});
