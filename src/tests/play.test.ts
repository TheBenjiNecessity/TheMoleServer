import ChallengeData from '../interfaces/challenge-data';
import Challenge from '../models/challenge.model';
import Episode from '../models/episode.model';
import Player, { PlayerInventory } from '../models/player.model';
import Question from '../models/quiz/question.model';
import Answer from '../models/quiz/quiz-answer.model';
import QuizAnswers from '../models/quiz/quiz-answers.model';
import Room, { IEpisodeGenerator, IMoleChooser } from '../models/room.model';
import ChallengeSampleService from '../services/sample/challenge.sample';
import { getMockRoomControllerWithRoom } from '../services/sample/room-controller.sample';
import ChallengeService from '../services/game/challenge.service';
import QuizSampleService from '../services/sample/quiz.sample';

jest.useFakeTimers();

function getMockComponents() {
	const room = new Room('TEST', 'en', new MoleChooser(), new EpisodeGenerator());
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

test('Plays through the entire game', () => {
	let { room, roomController } = getMockComponents();
	const { roomcode } = room;

	// Room created
	roomController.setChallengeDataForRoom(roomcode);

	// All players enter room
	roomController.addPlayerToRoom(roomcode, new Player('test1'));
	roomController.addPlayerToRoom(roomcode, new Player('test2'));
	roomController.addPlayerToRoom(roomcode, new Player('test3'));
	roomController.addPlayerToRoom(roomcode, new Player('test4'));
	roomController.addPlayerToRoom(roomcode, new Player('test5'));
	roomController.addPlayerToRoom(roomcode, new Player('test6'));
	roomController.addPlayerToRoom(roomcode, new Player('test7'));
	roomController.addPlayerToRoom(roomcode, new Player('test8'));
	roomController.addPlayerToRoom(roomcode, new Player('test9'));
	roomController.addPlayerToRoom(roomcode, new Player('test10'));

	// Expect for the room state to currently be in the "lobby"
	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.LOBBY);

	// The "go to game" button was clicked
	roomController.moveNext(roomcode);

	// Expect the room to be on the welcome page with a mole already selected and for there to be
	// ten players playing
	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.WELCOME);
	expect(roomController.getRoom(roomcode).playersStillPlaying.find((p) => p.isMole)).toBeTruthy();
	expect(roomController.getRoom(roomcode).playersStillPlaying.length).toBe(10);

	// The "start game" button was clicked
	roomController.moveNext(roomcode);

	// Expect the room to now be in state "episode start" and for the current episode to be loaded
	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.EPISODE_START);
	expect(roomController.getRoom(roomcode).currentEpisode).toBeTruthy();

	// the "start episode" button was clicked
	roomController.moveNext(roomcode);

	// Expect room to be in "challenge" state and expect the state of the current challenge to be
	// in role selection as this first challenge should be a role based challenge
	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.IN_CHALLENGE);
	let { currentChallenge } = roomController.getRoom(roomcode).currentEpisode;
	expect(currentChallenge.state).toBe(Challenge.CHALLENGE_STATES.ROLE_SELECTION);

	// All players raise their hands for different roles
	let players = roomController.getRoom(roomcode).playersStillPlaying;
	const challengeController = roomController
		.getRoom(roomcode)
		.currentEpisode.getCurrentChallengeController(roomController);
	challengeController.raiseHand(roomcode, players[0].name, currentChallenge.roles[0].name);
	challengeController.raiseHand(roomcode, players[1].name, currentChallenge.roles[0].name);
	challengeController.raiseHand(roomcode, players[2].name, currentChallenge.roles[0].name);
	challengeController.raiseHand(roomcode, players[3].name, currentChallenge.roles[0].name);
	challengeController.raiseHand(roomcode, players[4].name, currentChallenge.roles[0].name);
	challengeController.raiseHand(roomcode, players[5].name, currentChallenge.roles[1].name);
	challengeController.raiseHand(roomcode, players[6].name, currentChallenge.roles[1].name);
	challengeController.raiseHand(roomcode, players[7].name, currentChallenge.roles[1].name);
	challengeController.raiseHand(roomcode, players[8].name, currentChallenge.roles[1].name);
	challengeController.raiseHand(roomcode, players[9].name, currentChallenge.roles[1].name);

	// Some players agree to the roles chosen. It should not be necessary for all players to
	// raise their hands in order for the vote to go through as only a majority is needed
	challengeController.agreeToRoles(roomcode, players[0].name);
	challengeController.agreeToRoles(roomcode, players[1].name);
	challengeController.agreeToRoles(roomcode, players[2].name);
	challengeController.agreeToRoles(roomcode, players[3].name);
	challengeController.agreeToRoles(roomcode, players[4].name);

	// Expect that, after the players reach a majority vote, the challenge will move into the
	// "In game" state.
	currentChallenge = roomController.getRoom(roomcode).currentEpisode.currentChallenge;
	expect(currentChallenge.state).toBe(Challenge.CHALLENGE_STATES.IN_GAME);

	// Simulate the players winning 10 points and end the challenge
	roomController.addPoints(roomcode, 10);
	roomController.endChallenge(roomcode);

	expect(roomController.getRoom(roomcode).points).toBe(10);

	// Expect the room state to now be in between challenges (intermission)
	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.CHALLENGE_INTERMISSION);

	// Someone has clicked the start next challenge button
	roomController.moveNext(roomcode);

	// Expect the room state to now be in the next challenge
	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.IN_CHALLENGE);

	const doneCB = () => {
		roomController.endChallenge(roomcode);
	};

	// Run a challenge with a timer where nothing happens during the challenge
	roomController.startTimer(roomcode, 10, 1, () => {}, doneCB);

	jest.runAllTimers();

	// The state of the room should change to intermission when the timer is over
	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.CHALLENGE_INTERMISSION);

	// Someone has clicked the start next challenge button
	roomController.moveNext(roomcode);

	// Expect the room state to now be in the next challenge
	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.IN_CHALLENGE);

	// Simulate having a player win an exemption during the challenge
	roomController.giveObjectsToPlayer(roomcode, players[1].name, 'exemption', 1);
	roomController.endChallenge(roomcode);

	// Expect the room to now be in challenge intermission because the challenge is over
	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.CHALLENGE_INTERMISSION);

	// Someone has clicked to go to the quiz
	roomController.moveNext(roomcode);

	// Expect the room to no be in a state just before the quiz
	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.PRE_QUIZ_INTERMISSION);

	// Someone has clicked to go to the quiz
	roomController.moveNext(roomcode);

	// Expect the room to now be in the quiz waiting for players to complete their quizzes
	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.IN_QUIZ);

	// Prepare everyone's answers to the quiz
	room = roomController.getRoom(roomcode);
	let { quiz } = room.currentEpisode;

	let moleAnswers = quiz.questions.map((q) => new Answer(q, 0));
	let greatAnswers = quiz.questions.map((q, i) => {
		if (i < 3) {
			return new Answer(q, 1);
		} else {
			return new Answer(q, 0);
		}
	});
	let loserAnswers = quiz.questions.map((q) => new Answer(q, 1));

	for (let i = 0; i < room.playersStillPlaying.length; i++) {
		let player = room.playersStillPlaying[i];
		let inventory: PlayerInventory = { exemption: 0, 'black-exemption': 0, joker: 0 };

		if (i === 1) {
			inventory = { exemption: 1, 'black-exemption': 0, joker: 0 };
		}

		if (i === 0) {
			roomController.quizDone(roomcode, player.name, new QuizAnswers(moleAnswers, 1, inventory));
		} else if (i === 1) {
			roomController.quizDone(roomcode, player.name, new QuizAnswers(loserAnswers, 100, inventory));
		} else if (i === 2) {
			roomController.quizDone(roomcode, player.name, new QuizAnswers(loserAnswers, 1, inventory));
		} else {
			roomController.quizDone(roomcode, player.name, new QuizAnswers(greatAnswers, 50, inventory));
		}
	}

	// Everyone has finished their quizzes therefore the room should move to post quiz intermission state
	// and the eliminated player should be "test3" since other players either got better quiz scores, was
	// the mole, or used an exemption. Also, expect player "test2" to have used their exemption.
	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.POST_QUIZ_INTERMISSION);
	expect(roomController.getRoom(roomcode).currentEpisode.eliminatedPlayer.name).toBe('test3');
	expect(roomController.getRoom(roomcode).playersStillPlaying[1].numExemptions).toBe(0);

	// Simulate someone clicking on the next button to go to the execution
	roomController.moveNext(roomcode);

	// Expect the room to be in the execution state and for the eliminated player to be removed from the
	// playersStillPlaying array
	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.EXECUTION);
	let eliminatedPlayer = roomController.getRoom(roomcode).playersStillPlaying.find((p) => p.name === 'test3');
	expect(eliminatedPlayer).toBeFalsy();
	expect(roomController.getRoom(roomcode).playersStillPlaying).toHaveLength(9);

	// Simulate the execution to be concluded
	roomController.moveNext(roomcode);

	// Expect the room to now be in the execution wrapup state
	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.EXECUTION_WRAPUP);

	// Simulate a player clicking the next button
	roomController.moveNext(roomcode);

	// Expect the room to now be back in the episode start state
	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.EPISODE_START);

	roomController.moveNext(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.IN_CHALLENGE);

	roomController.addPoints(roomcode, 5);
	roomController.endChallenge(roomcode);

	expect(roomController.getRoom(roomcode).points).toBe(15);
	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.CHALLENGE_INTERMISSION);

	roomController.moveNext(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.IN_CHALLENGE);

	roomController.endChallenge(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.CHALLENGE_INTERMISSION);

	roomController.moveNext(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.IN_CHALLENGE);

	roomController.endChallenge(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.CHALLENGE_INTERMISSION);

	roomController.moveNext(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.PRE_QUIZ_INTERMISSION);

	roomController.moveNext(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.IN_QUIZ);

	room = roomController.getRoom(roomcode);
	quiz = room.currentEpisode.quiz;

	moleAnswers = quiz.questions.map((q) => new Answer(q, 0));
	greatAnswers = quiz.questions.map((q, i) => {
		if (i < 3) {
			return new Answer(q, 1);
		} else {
			return new Answer(q, 0);
		}
	});
	loserAnswers = quiz.questions.map((q) => new Answer(q, 1));

	for (let i = 0; i < room.playersStillPlaying.length; i++) {
		let player = room.playersStillPlaying[i];

		if (i === 0) {
			roomController.quizDone(roomcode, player.name, new QuizAnswers(moleAnswers, 1));
		} else if (i === 1) {
			roomController.quizDone(roomcode, player.name, new QuizAnswers(loserAnswers, 100));
		} else if (i === 2) {
			roomController.quizDone(roomcode, player.name, new QuizAnswers(loserAnswers, 1));
		} else {
			roomController.quizDone(roomcode, player.name, new QuizAnswers(greatAnswers, 50));
		}
	}

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.POST_QUIZ_INTERMISSION);
	expect(roomController.getRoom(roomcode).currentEpisode.eliminatedPlayer.name).toBe('test2');
});

/*
 * episode start => in challenge => challenge intermission => ... => in challenge => challenge intermission => 
 * pre quiz intermission => in quiz => post quiz intermission => execution => execution wrap up => episode start
 */
