import Challenge from '../models/challenge.model';
import Player, { PlayerInventory } from '../models/player.model';
import Answer from '../models/quiz/quiz-answer.model';
import QuizAnswers from '../models/quiz/quiz-answers.model';
import Room from '../models/room.model';
import RoomController from '../controllers/room.controller';
import { getMockComponents } from '../services/sample/mock-components.service';

jest.useFakeTimers();

let testRoom: Room = null;
let testRoomController: RoomController = null;
let testRoomCode: string = null;

beforeEach(() => {
	const withRoles = new Array(30).fill(false);
	withRoles[0] = true;
	let { roomcode, roomController } = getMockComponents(0, withRoles);
	testRoomController = roomController;
	testRoomCode = roomcode;
	testRoom = testRoomController.getRoom(testRoomCode);
});

test('Plays through the entire game', () => {
	// Room created
	testRoomController.setChallengeDataForRoom(testRoomCode);

	// All players enter testRoom
	testRoomController.addPlayerToRoom(testRoomCode, new Player('test1'));
	testRoomController.addPlayerToRoom(testRoomCode, new Player('test2'));
	testRoomController.addPlayerToRoom(testRoomCode, new Player('test3'));
	testRoomController.addPlayerToRoom(testRoomCode, new Player('test4'));
	testRoomController.addPlayerToRoom(testRoomCode, new Player('test5'));
	testRoomController.addPlayerToRoom(testRoomCode, new Player('test6'));
	testRoomController.addPlayerToRoom(testRoomCode, new Player('test7'));
	testRoomController.addPlayerToRoom(testRoomCode, new Player('test8'));
	testRoomController.addPlayerToRoom(testRoomCode, new Player('test9'));
	testRoomController.addPlayerToRoom(testRoomCode, new Player('test10'));

	// Expect for the testRoom state to currently be in the "lobby"
	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.LOBBY);

	// The "go to game" button was clicked
	testRoomController.moveNext(testRoomCode);

	// Expect the testRoom to be on the welcome page with a mole already selected and for there to be
	// ten players playing
	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.WELCOME);
	expect(testRoomController.getRoom(testRoomCode).playersStillPlaying.find((p) => p.isMole)).toBeTruthy();
	expect(testRoomController.getRoom(testRoomCode).playersStillPlaying.length).toBe(10);

	// The "start game" button was clicked
	testRoomController.moveNext(testRoomCode);

	// Expect the testRoom to now be in state "episode start" and for the current episode to be loaded
	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.EPISODE_START);
	expect(testRoomController.getRoom(testRoomCode).currentEpisode).toBeTruthy();

	// the "start episode" button was clicked
	testRoomController.moveNext(testRoomCode);

	// Expect testRoom to be in "challenge" state and expect the state of the current challenge to be
	// in role selection as this first challenge should be a role based challenge
	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.IN_CHALLENGE);
	let { currentChallenge } = testRoomController.getRoom(testRoomCode).currentEpisode;
	expect(currentChallenge.state).toBe(Challenge.CHALLENGE_STATES.ROLE_SELECTION);

	// All players raise their hands for different roles
	let players = testRoomController.getRoom(testRoomCode).playersStillPlaying;
	const challengeController = testRoomController
		.getRoom(testRoomCode)
		.currentEpisode.getCurrentChallengeController(testRoomController);
	challengeController.raiseHand(testRoomCode, players[0].name, currentChallenge.roles[0].name);
	challengeController.raiseHand(testRoomCode, players[1].name, currentChallenge.roles[0].name);
	challengeController.raiseHand(testRoomCode, players[2].name, currentChallenge.roles[0].name);
	challengeController.raiseHand(testRoomCode, players[3].name, currentChallenge.roles[0].name);
	challengeController.raiseHand(testRoomCode, players[4].name, currentChallenge.roles[0].name);
	challengeController.raiseHand(testRoomCode, players[5].name, currentChallenge.roles[1].name);
	challengeController.raiseHand(testRoomCode, players[6].name, currentChallenge.roles[1].name);
	challengeController.raiseHand(testRoomCode, players[7].name, currentChallenge.roles[1].name);
	challengeController.raiseHand(testRoomCode, players[8].name, currentChallenge.roles[1].name);
	challengeController.raiseHand(testRoomCode, players[9].name, currentChallenge.roles[1].name);

	// Some players agree to the roles chosen. It should not be necessary for all players to
	// raise their hands in order for the vote to go through as only a majority is needed
	challengeController.agreeToRoles(testRoomCode, players[0].name);
	challengeController.agreeToRoles(testRoomCode, players[1].name);
	challengeController.agreeToRoles(testRoomCode, players[2].name);
	challengeController.agreeToRoles(testRoomCode, players[3].name);
	challengeController.agreeToRoles(testRoomCode, players[4].name);

	// Expect that, after the players reach a majority vote, the challenge will move into the
	// "In game" state.
	currentChallenge = testRoomController.getRoom(testRoomCode).currentEpisode.currentChallenge;
	expect(currentChallenge.state).toBe(Challenge.CHALLENGE_STATES.IN_GAME);

	// Simulate the players winning 10 points and end the challenge
	testRoomController.addPoints(testRoomCode, 10);
	testRoomController.endChallenge(testRoomCode);

	expect(testRoomController.getRoom(testRoomCode).points).toBe(10);

	// Expect the testRoom state to now be in between challenges (intermission)
	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.CHALLENGE_INTERMISSION);

	// Someone has clicked the start next challenge button
	testRoomController.moveNext(testRoomCode);

	// Expect the testRoom state to now be in the next challenge
	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.IN_CHALLENGE);

	const doneCB = () => {
		testRoomController.endChallenge(testRoomCode);
	};

	// Run a challenge with a timer where nothing happens during the challenge
	testRoomController.startTimer(testRoomCode, 10, 1, () => {}, doneCB);

	jest.runAllTimers();

	// The state of the testRoom should change to intermission when the timer is over
	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.CHALLENGE_INTERMISSION);

	// Someone has clicked the start next challenge button
	testRoomController.moveNext(testRoomCode);

	// Expect the testRoom state to now be in the next challenge
	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.IN_CHALLENGE);

	// Simulate having a player win an exemption during the challenge
	testRoomController.giveObjectsToPlayer(testRoomCode, players[1].name, 'exemption', 1);
	testRoomController.endChallenge(testRoomCode);

	// Expect the testRoom to now be in challenge intermission because the challenge is over
	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.CHALLENGE_INTERMISSION);

	// Someone has clicked to go to the quiz
	testRoomController.moveNext(testRoomCode);

	// Expect the testRoom to no be in a state just before the quiz
	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.PRE_QUIZ_INTERMISSION);

	// Someone has clicked to go to the quiz
	testRoomController.moveNext(testRoomCode);

	// Expect the testRoom to now be in the quiz waiting for players to complete their quizzes
	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.IN_QUIZ);

	// Prepare everyone's answers to the quiz
	testRoom = testRoomController.getRoom(testRoomCode);
	let { quiz } = testRoom.currentEpisode;

	let moleAnswers = quiz.questions.map((q) => new Answer(q, 0));
	let greatAnswers = quiz.questions.map((q, i) => {
		if (i < 3) {
			return new Answer(q, 1);
		} else {
			return new Answer(q, 0);
		}
	});
	let loserAnswers = quiz.questions.map((q) => new Answer(q, 1));

	for (let i = 0; i < testRoom.playersStillPlaying.length; i++) {
		let player = testRoom.playersStillPlaying[i];
		let inventory: PlayerInventory = { exemption: 0, 'black-exemption': 0, joker: 0 };

		if (i === 1) {
			inventory = { exemption: 1, 'black-exemption': 0, joker: 0 };
		}

		if (i === 0) {
			testRoomController.quizDone(testRoomCode, player.name, new QuizAnswers(moleAnswers, 1, inventory));
		} else if (i === 1) {
			testRoomController.quizDone(testRoomCode, player.name, new QuizAnswers(loserAnswers, 100, inventory));
		} else if (i === 2) {
			testRoomController.quizDone(testRoomCode, player.name, new QuizAnswers(loserAnswers, 1, inventory));
		} else {
			testRoomController.quizDone(testRoomCode, player.name, new QuizAnswers(greatAnswers, 50, inventory));
		}
	}

	// Everyone has finished their quizzes therefore the testRoom should move to post quiz intermission state
	// and the eliminated player should be "test3" since other players either got better quiz scores, was
	// the mole, or used an exemption. Also, expect player "test2" to have used their exemption.
	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.POST_QUIZ_INTERMISSION);
	expect(testRoomController.getRoom(testRoomCode).currentEpisode.eliminatedPlayer.name).toBe('test3');
	expect(testRoomController.getRoom(testRoomCode).playersStillPlaying[1].numExemptions).toBe(0);

	// Simulate someone clicking on the next button to go to the execution
	testRoomController.moveNext(testRoomCode);

	// Expect the testRoom to be in the execution state and for the eliminated player to be removed from the
	// playersStillPlaying array
	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.EXECUTION);
	let eliminatedPlayer = testRoomController.getRoom(testRoomCode).playersStillPlaying.find((p) => p.name === 'test3');
	expect(eliminatedPlayer).toBeFalsy();
	expect(testRoomController.getRoom(testRoomCode).playersStillPlaying).toHaveLength(9);

	// Simulate the execution to be concluded
	testRoomController.moveNext(testRoomCode);

	// Expect the testRoom to now be in the execution wrapup state
	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.EXECUTION_WRAPUP);

	// Simulate a player clicking the next button
	testRoomController.moveNext(testRoomCode);

	// Expect the testRoom to now be back in the episode start state
	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.EPISODE_START);

	testRoomController.moveNext(testRoomCode);

	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.IN_CHALLENGE);

	testRoomController.addPoints(testRoomCode, 5);
	testRoomController.endChallenge(testRoomCode);

	expect(testRoomController.getRoom(testRoomCode).points).toBe(15);
	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.CHALLENGE_INTERMISSION);

	testRoomController.moveNext(testRoomCode);

	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.IN_CHALLENGE);

	testRoomController.endChallenge(testRoomCode);

	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.CHALLENGE_INTERMISSION);

	testRoomController.moveNext(testRoomCode);

	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.IN_CHALLENGE);

	testRoomController.endChallenge(testRoomCode);

	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.CHALLENGE_INTERMISSION);

	testRoomController.moveNext(testRoomCode);

	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.PRE_QUIZ_INTERMISSION);

	testRoomController.moveNext(testRoomCode);

	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.IN_QUIZ);

	testRoom = testRoomController.getRoom(testRoomCode);
	quiz = testRoom.currentEpisode.quiz;

	moleAnswers = quiz.questions.map((q) => new Answer(q, 0));
	greatAnswers = quiz.questions.map((q, i) => {
		if (i < 3) {
			return new Answer(q, 1);
		} else {
			return new Answer(q, 0);
		}
	});
	loserAnswers = quiz.questions.map((q) => new Answer(q, 1));

	for (let i = 0; i < testRoom.playersStillPlaying.length; i++) {
		let player = testRoom.playersStillPlaying[i];

		if (i === 0) {
			testRoomController.quizDone(testRoomCode, player.name, new QuizAnswers(moleAnswers, 1));
		} else if (i === 1) {
			testRoomController.quizDone(testRoomCode, player.name, new QuizAnswers(loserAnswers, 100));
		} else if (i === 2) {
			testRoomController.quizDone(testRoomCode, player.name, new QuizAnswers(loserAnswers, 1));
		} else {
			testRoomController.quizDone(testRoomCode, player.name, new QuizAnswers(greatAnswers, 50));
		}
	}

	expect(testRoomController.getRoom(testRoomCode).state).toBe(Room.ROOM_STATES.POST_QUIZ_INTERMISSION);
	expect(testRoomController.getRoom(testRoomCode).currentEpisode.eliminatedPlayer.name).toBe('test2');
});

/*
 * episode start => in challenge => challenge intermission => ... => in challenge => challenge intermission => 
 * pre quiz intermission => in quiz => post quiz intermission => execution => execution wrap up => episode start
 */
