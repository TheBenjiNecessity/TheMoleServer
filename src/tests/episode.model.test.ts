import ButtonChallenge from '../challenges/button/model';
import Challenge from '../models/challenge.model';
import Episode from '../models/episode.model';
import Player from '../models/player.model';
import Room from '../models/room.model';
import EpisodeSampleService from '../models/samples/episode.sample';
import RoomSampleService from '../models/samples/room.sample';
import questionData from '../models/quiz/question.data';
import QuizSampleService from '../models/samples/quiz.sample';

const NUMBER_OF_PLAYERS = 5;

function getMockRoom() {
	return RoomSampleService.getTestRoomForNumPlayers(NUMBER_OF_PLAYERS);
}

function getMockChallenge(room) {
	return new ButtonChallenge(room.playersStillPlaying, '', '', []);
}

function getMockEpisode(room: Room, challenge: Challenge) {
	return new Episode(room.playersStillPlaying, [ challenge ], questionData);
}

function getMockComponents() {
	let room = getMockRoom();
	let challenge = getMockChallenge(room);
	let episode = getMockEpisode(room, challenge);
	room.currentEpisode = episode;

	return { room, challenge, episode };
}

test('Tests episode init', () => {
	let { episode } = getMockComponents();

	expect(episode.currentChallengeIndex).toBe(0);
	expect(episode.challenges.length).toEqual(1);
	expect(episode.players.length).toEqual(NUMBER_OF_PLAYERS);
});

test('Tests getter and setters', () => {
	let { challenge, episode } = getMockComponents();

	expect(episode.currentChallenge).toEqual(challenge);
	expect(episode.episodeIsOver).toEqual(false);
	expect(episode.molePlayer.isMole).toBeTruthy();
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

	episode.setQuizResultsForPlayer(episode.players[0].name, greatQuizAnswers);

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

	// It's assumed that player[0] is the mole
	episode.setQuizResultsForPlayer(episode.players[0].name, moleQuizAnswers);
	episode.setQuizResultsForPlayer(episode.players[1].name, greatQuizAnswers);
	episode.setQuizResultsForPlayer(episode.players[2].name, goodQuizAnswers);
	episode.setQuizResultsForPlayer(episode.players[3].name, badQuizAnswers);
	episode.setQuizResultsForPlayer(episode.players[4].name, loserQuizAnswers);

	expect(episode.allPlayersFinishedQuiz).toBeTruthy();

	let eliminatedPlayer = episode.eliminatedPlayer;

	expect(eliminatedPlayer.name).toBe(episode.players[4].name);
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
	episode.setQuizResultsForPlayer(episode.players[0].name, moleQuizAnswers);
	episode.setQuizResultsForPlayer(episode.players[1].name, greatQuizAnswers1);
	episode.setQuizResultsForPlayer(episode.players[2].name, greatQuizAnswers2);
	episode.setQuizResultsForPlayer(episode.players[3].name, greatQuizAnswers3);
	episode.setQuizResultsForPlayer(episode.players[4].name, greatQuizAnswers4);

	expect(episode.allPlayersFinishedQuiz).toBeTruthy();

	let eliminatedPlayer = episode.eliminatedPlayer;

	expect(eliminatedPlayer.name).toBe(episode.players[4].name);
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
	episode.setQuizResultsForPlayer(episode.players[0].name, moleQuizAnswers);
	episode.setQuizResultsForPlayer(episode.players[1].name, greatQuizAnswers1);
	episode.setQuizResultsForPlayer(episode.players[2].name, greatQuizAnswers2);
	episode.setQuizResultsForPlayer(episode.players[3].name, greatQuizAnswers3);
	episode.setQuizResultsForPlayer(episode.players[4].name, loserQuizAnswers);

	expect(episode.allPlayersFinishedQuiz).toBeTruthy();

	let eliminatedPlayer = episode.eliminatedPlayer;

	expect(eliminatedPlayer.name).toBe(episode.players[4].name);
});

test.skip('Tests eliminatedPlayer getter (two players have identical low scores)', () => {
	let { episode } = getMockComponents();
	episode.goToNextChallenge();

	let quiz = QuizSampleService.getTestQuiz();
	let moleQuizAnswers = QuizSampleService.getMoleQuizAnswers(quiz);
	let loserQuizAnswers = QuizSampleService.getLoserQuizAnswers(moleQuizAnswers, 1);

	// It's assumed that player[0] is the mole
	episode.setQuizResultsForPlayer(episode.players[0].name, moleQuizAnswers);
	episode.setQuizResultsForPlayer(episode.players[1].name, loserQuizAnswers);
	episode.setQuizResultsForPlayer(episode.players[2].name, loserQuizAnswers);
	episode.setQuizResultsForPlayer(episode.players[3].name, loserQuizAnswers);
	episode.setQuizResultsForPlayer(episode.players[4].name, loserQuizAnswers);

	expect(episode.allPlayersFinishedQuiz).toBeTruthy();

	let eliminatedPlayer = episode.eliminatedPlayer;

	expect(eliminatedPlayer.name).toBe(episode.players[4].name);
});
