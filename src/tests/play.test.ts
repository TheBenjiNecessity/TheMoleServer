import ButtonChallengeController from '../challenges/button/controller';
import RoomController from '../controllers/room.controller';
import ChallengeData from '../interfaces/challenge-data';
import Challenge from '../models/challenge.model';
import Episode from '../models/episode.model';
import Player, { PlayerInventory } from '../models/player.model';
import Question from '../models/quiz/question.model';
import Answer from '../models/quiz/quiz-answer.model';
import QuizAnswers from '../models/quiz/quiz-answers.model';
import Room, { IEpisodeGenerator, IMoleChooser } from '../models/room.model';
import ChallengeSampleService from '../services/sample/challenge.sample';
import { getMockRoomController } from '../services/sample/room-controller.sample';
import ChallengeService from '../services/game/challenge.service';

jest.useFakeTimers();

function getMockChallengeController(roomController: RoomController) {
	return new ButtonChallengeController(roomController);
}

function getMockComponents() {
	const room = new Room('TEST', 'en', new MoleChooser(), new EpisodeGenerator());
	let challengeData = [];
	for (let i = 0; i < 30; i++) {
		const challengeDatum = ChallengeSampleService.getTestChallengeData(room);
		challengeDatum._type = 'test ' + i;
		challengeData.push(challengeDatum);
	}

	let roomController = getMockRoomController(challengeData);
	let challengeController = getMockChallengeController(roomController);

	roomController.setRoom(room);

	return { room, roomController, challengeController };
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
		let testQuestions = [];

		for (let i = 0; i < 10; i++) {
			let question: Question = {
				text: 'Test question?',
				type: 'choices',
				choices: [ 'One', 'Two', 'Three' ]
			};
			testQuestions.push(question);
		}

		for (let i = 0; i < numChallenges; i++) {
			let numRestrictedChallenges = ChallengeService.listChallengesForNumPlayers(
				playersStillPlaying.length,
				unusedChallenges,
				challenges
			);

			if (numRestrictedChallenges.length <= 0) {
				continue;
			}

			numRestrictedChallenges.shuffle();
			const tempChallengeData = numRestrictedChallenges[0];
			tempChallengeData.initModel(playersStillPlaying, 'en');
			challenges.push(tempChallengeData);
		}

		return new Episode(playersStillPlaying, challenges, testQuestions);
	}
}

test('Plays through the entire game', () => {
	let { room, roomController, challengeController } = getMockComponents();
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

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.LOBBY);

	// The "go to game" button was clicked
	roomController.moveNext(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.WELCOME);
	expect(roomController.getRoom(roomcode).playersStillPlaying.find((p) => p.isMole)).toBeTruthy();
	expect(roomController.getRoom(roomcode).playersStillPlaying.length).toBe(10);

	// The "start game" button was clicked
	roomController.moveNext(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.EPISODE_START);
	expect(roomController.getRoom(roomcode).currentEpisode).toBeTruthy();

	// the "start episode" button was clicked
	roomController.moveNext(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.IN_CHALLENGE);
	let { currentChallenge } = roomController.getRoom(roomcode).currentEpisode;
	expect(currentChallenge.state).toBe(Challenge.CHALLENGE_STATES.ROLE_SELECTION);

	// All players raise their hands for different roles
	let players = roomController.getRoom(roomcode).playersStillPlaying;
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

	// Some players agree to the roles chosen
	challengeController.agreeToRoles(roomcode, players[0].name);
	challengeController.agreeToRoles(roomcode, players[1].name);
	challengeController.agreeToRoles(roomcode, players[2].name);
	challengeController.agreeToRoles(roomcode, players[3].name);
	challengeController.agreeToRoles(roomcode, players[4].name);

	currentChallenge = roomController.getRoom(roomcode).currentEpisode.currentChallenge;
	expect(currentChallenge.state).toBe(Challenge.CHALLENGE_STATES.IN_GAME);

	roomController.addPoints(roomcode, 10);

	roomController.endChallenge(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.CHALLENGE_INTERMISSION);

	roomController.moveNext(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.IN_CHALLENGE);

	let doneCB = () => {
		roomController.endChallenge(roomcode);
	};

	roomController.startTimer(roomcode, 10, 1, () => {}, doneCB);

	jest.runAllTimers();

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.CHALLENGE_INTERMISSION);

	roomController.moveNext(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.IN_CHALLENGE);

	roomController.giveObjectsToPlayer(roomcode, players[1].name, 'exemption', 1);

	roomController.endChallenge(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.CHALLENGE_INTERMISSION);

	roomController.moveNext(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.PRE_QUIZ_INTERMISSION);

	roomController.moveNext(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.IN_QUIZ);

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

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.POST_QUIZ_INTERMISSION);
	expect(roomController.getRoom(roomcode).currentEpisode.eliminatedPlayer.name).toBe('test3');
	expect(roomController.getRoom(roomcode).playersStillPlaying[1].numExemptions).toBe(0);

	roomController.moveNext(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.EXECUTION);
	let eliminatedPlayer = roomController.getRoom(roomcode).playersStillPlaying.find((p) => p.name === 'test3');
	expect(eliminatedPlayer).toBeFalsy();

	roomController.moveNext(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.EXECUTION_WRAPUP);

	roomController.moveNext(roomcode);

	expect(roomController.getRoom(roomcode).state).toBe(Room.ROOM_STATES.EPISODE_START);
});
