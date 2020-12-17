import Player from '../models/player.model';
import Room from '../models/room.model';
import ChallengeSampleService from '../models/samples/challenge.sample';
import RoomSampleService from '../models/samples/room.sample';
import Question from '../models/quiz/question.model';

test('Tests room init', () => {
	let room = new Room('TEST', 'en');
	expect(room.playersStillPlaying.length).toBe(0);
	expect(room.isFull).toBe(false);
	expect(room.isInProgress).toBe(false);
	expect(room.roomcode).toBe('TEST');
	expect(room.state).toBe('lobby');
});

test('Tests empty room', () => {
	let room = RoomSampleService.getTestRoomWithNoPlayers();
	expect(room.playersStillPlaying.length).toBe(0);
	expect(room.isFull).toBe(false);
	expect(room.isInProgress).toBe(false);
});

test('Tests partially full room', () => {
	let room = RoomSampleService.getTestRoomWithFivePlayers();
	expect(room.playersStillPlaying.length).toBe(5);
	expect(room.playersStillPlaying[0].name).toBe('test1');
	expect(room.playersStillPlaying[1].name).toBe('test2');
	expect(room.playersStillPlaying[2].name).toBe('test3');
	expect(room.playersStillPlaying[3].name).toBe('test4');
	expect(room.playersStillPlaying[4].name).toBe('test5');
	expect(room.isFull).toBe(false);
	expect(room.isInProgress).toBe(false);
});

test('Tests full room', () => {
	let room = RoomSampleService.getTestRoomWithTenPlayers();
	expect(room.playersStillPlaying.length).toBe(10);
	expect(room.playersStillPlaying[0].name).toBe('test1');
	expect(room.playersStillPlaying[1].name).toBe('test2');
	expect(room.playersStillPlaying[2].name).toBe('test3');
	expect(room.playersStillPlaying[3].name).toBe('test4');
	expect(room.playersStillPlaying[4].name).toBe('test5');
	expect(room.playersStillPlaying[5].name).toBe('test6');
	expect(room.playersStillPlaying[6].name).toBe('test7');
	expect(room.playersStillPlaying[7].name).toBe('test8');
	expect(room.playersStillPlaying[8].name).toBe('test9');
	expect(room.playersStillPlaying[9].name).toBe('test10');
	expect(room.isFull).toBe(true);
	expect(room.isInProgress).toBe(false);
});

test('Tests adding player to empty room', () => {
	let room = RoomSampleService.getTestRoomWithNoPlayers();
	let newTestPlayer = new Player('test11');

	expect(room.addPlayer(newTestPlayer)).toBe(true);
	expect(room.playersStillPlaying.length).toBe(1);
	expect(room.playersStillPlaying[room.playersStillPlaying.length - 1].name).toBe('test11');
});

test('Tests adding player to partially full room', () => {
	let room = RoomSampleService.getTestRoomWithFivePlayers();
	let newTestPlayer = new Player('test11');
	expect(room.addPlayer(newTestPlayer)).toBe(true);
	expect(room.playersStillPlaying.length).toBe(6);
	expect(room.playersStillPlaying[room.playersStillPlaying.length - 1].name).toBe('test11');
});

test('Tests adding player to full room', () => {
	let room = RoomSampleService.getTestRoomWithTenPlayers();
	let newTestPlayer = new Player('test11');
	expect(room.addPlayer(newTestPlayer)).toBe(false);
	expect(room.playersStillPlaying.length).toBe(10);
});

test('Tests adding player to room in progress', () => {
	let room = RoomSampleService.getTestRoomWithFivePlayers();
	let newTestPlayer = new Player('test11');
	room.isInProgress = true;
	expect(room.addPlayer(newTestPlayer)).toBe(false);
	expect(room.playersStillPlaying.length).toBe(5);
});

test('Tests removing player', () => {
	const room = RoomSampleService.getTestRoomWithTenPlayers();
	const firstPlayer = room.playersStillPlaying[0];
	const { name: firstName } = room.playersStillPlaying[0];
	const { name: secondName } = room.playersStillPlaying[1];

	expect(room.playersStillPlaying.find((p) => p.name === firstName)).toBeTruthy();
	expect(room.playersStillPlaying.find((p) => p.name === secondName)).toBeTruthy();

	room.removePlayer(firstName);

	expect(room.playersStillPlaying).toHaveLength(9);
	expect(room.playersStillPlaying.find((p) => p.name === firstName)).toBeFalsy();

	room.isInProgress = true;

	try {
		room.removePlayer(secondName);
	} catch (error) {}

	expect(room.playersStillPlaying).toHaveLength(9);
	expect(room.playersStillPlaying.find((p) => p.name === secondName)).toBeTruthy();
});

test('Tests "hasPlayer" method', () => {
	let room = RoomSampleService.getTestRoomWithNoPlayers();
	let newTestPlayer = new Player('test11');

	expect(room.hasPlayer(newTestPlayer.name)).toBe(false);

	room.addPlayer(newTestPlayer);

	expect(room.hasPlayer(newTestPlayer.name)).toBe(true);
});

test('Tests numRestrictedChallenges getter', () => {
	const room = RoomSampleService.getTestRoomWithFivePlayers();
	const challengeData = [
		ChallengeSampleService.getTestChallengeData(room),
		ChallengeSampleService.getTestChallengeData(room),
		ChallengeSampleService.getTestChallengeData(room),
		ChallengeSampleService.getTestChallengeData(room)
	];
	room.addChallengeData(challengeData);

	const { numRestrictedChallenges } = room;

	expect(numRestrictedChallenges.length).toBe(4);

	for (const challengeData of numRestrictedChallenges) {
		expect(challengeData.maxPlayers).toBeGreaterThanOrEqual(5);
		expect(challengeData.minPlayers).toBeLessThanOrEqual(5);
	}
});

test('Tests numRestrictedChallenges getter', () => {
	const room = RoomSampleService.getTestRoomWithFivePlayers();
	room.chooseMole();
	const { molePlayer } = room;

	expect(molePlayer).toBeTruthy();
	expect(molePlayer.isMole).toBeTruthy();
});

test('Tests giveObjectsToPlayer (exemption)', () => {
	let objectName = 'exemption';
	let room = RoomSampleService.getTestRoomWithFivePlayers();

	room.giveObjectsToPlayer(room.playersStillPlaying[0].name, objectName);
	room.giveObjectsToPlayer(room.playersStillPlaying[1].name, objectName, 1);
	room.giveObjectsToPlayer(room.playersStillPlaying[2].name, objectName, 2);

	expect(room.playersStillPlaying[0].objects[objectName]).toBe(1);
	expect(room.playersStillPlaying[1].objects[objectName]).toBe(1);
	expect(room.playersStillPlaying[2].objects[objectName]).toBe(2);
});

test('Tests giveObjectsToPlayer (joker)', () => {
	let objectName = 'joker';
	let room = RoomSampleService.getTestRoomWithFivePlayers();

	room.giveObjectsToPlayer(room.playersStillPlaying[0].name, objectName);
	room.giveObjectsToPlayer(room.playersStillPlaying[1].name, objectName, 1);
	room.giveObjectsToPlayer(room.playersStillPlaying[2].name, objectName, 2);

	expect(room.playersStillPlaying[0].objects[objectName]).toBe(1);
	expect(room.playersStillPlaying[1].objects[objectName]).toBe(1);
	expect(room.playersStillPlaying[2].objects[objectName]).toBe(2);
});

test('Tests giveObjectsToPlayer (black exemption)', () => {
	let objectName = 'black-exemption';
	let room = RoomSampleService.getTestRoomWithFivePlayers();

	room.giveObjectsToPlayer(room.playersStillPlaying[0].name, objectName);
	room.giveObjectsToPlayer(room.playersStillPlaying[1].name, objectName, 1);
	room.giveObjectsToPlayer(room.playersStillPlaying[2].name, objectName, 2);

	expect(room.playersStillPlaying[0].objects[objectName]).toBe(1);
	expect(room.playersStillPlaying[1].objects[objectName]).toBe(1);
	expect(room.playersStillPlaying[2].objects[objectName]).toBe(2);
});

test('Tests removeObjectsFromPlayer (exemption)', () => {
	let objectName = 'exemption';
	let room = RoomSampleService.getTestRoomWithFivePlayers();

	room.giveObjectsToPlayer(room.playersStillPlaying[0].name, objectName);
	room.giveObjectsToPlayer(room.playersStillPlaying[1].name, objectName, 1);
	room.giveObjectsToPlayer(room.playersStillPlaying[2].name, objectName, 2);

	room.removeObjectsFromPlayer(room.playersStillPlaying[0].name, objectName);
	room.removeObjectsFromPlayer(room.playersStillPlaying[1].name, objectName, 1);
	room.removeObjectsFromPlayer(room.playersStillPlaying[2].name, objectName, 2);

	expect(room.playersStillPlaying[0].objects[objectName]).toBe(0);
	expect(room.playersStillPlaying[1].objects[objectName]).toBe(0);
	expect(room.playersStillPlaying[2].objects[objectName]).toBe(0);
});

test('Tests removeObjectsFromPlayer (joker)', () => {
	let objectName = 'joker';
	let room = RoomSampleService.getTestRoomWithFivePlayers();

	room.giveObjectsToPlayer(room.playersStillPlaying[0].name, objectName);
	room.giveObjectsToPlayer(room.playersStillPlaying[1].name, objectName, 1);
	room.giveObjectsToPlayer(room.playersStillPlaying[2].name, objectName, 2);

	room.removeObjectsFromPlayer(room.playersStillPlaying[0].name, objectName);
	room.removeObjectsFromPlayer(room.playersStillPlaying[1].name, objectName, 1);
	room.removeObjectsFromPlayer(room.playersStillPlaying[2].name, objectName, 2);

	expect(room.playersStillPlaying[0].objects[objectName]).toBe(0);
	expect(room.playersStillPlaying[1].objects[objectName]).toBe(0);
	expect(room.playersStillPlaying[2].objects[objectName]).toBe(0);
});

test('Tests removeObjectsFromPlayer (black-exemption)', () => {
	let objectName = 'black-exemption';
	let room = RoomSampleService.getTestRoomWithFivePlayers();

	room.giveObjectsToPlayer(room.playersStillPlaying[0].name, objectName);
	room.giveObjectsToPlayer(room.playersStillPlaying[1].name, objectName, 1);
	room.giveObjectsToPlayer(room.playersStillPlaying[2].name, objectName, 2);

	room.removeObjectsFromPlayer(room.playersStillPlaying[0].name, objectName);
	room.removeObjectsFromPlayer(room.playersStillPlaying[1].name, objectName, 1);
	room.removeObjectsFromPlayer(room.playersStillPlaying[2].name, objectName, 2);

	expect(room.playersStillPlaying[0].objects[objectName]).toBe(0);
	expect(room.playersStillPlaying[1].objects[objectName]).toBe(0);
	expect(room.playersStillPlaying[2].objects[objectName]).toBe(0);
});

test('Tests moveNext', () => {
	let room = RoomSampleService.getTestRoomWithFivePlayers();
	expect(room.state).toBe('lobby');
	room.moveNext();
	expect(room.state).toBe('game-welcome');
	room.moveNext();
	expect(room.state).toBe('episode-start');
});

test('Tests moveNext', () => {
	const room = RoomSampleService.getTestRoomWithFivePlayers();
	const mockQuestion: Question = {
		text: '',
		type: '',
		choices: [ '' ]
	};
	room.unaskedQuestions = [
		{ ...mockQuestion, text: 'test1' },
		{ ...mockQuestion, text: 'test2' },
		{ ...mockQuestion, text: 'test3' },
		{ ...mockQuestion, text: 'test4' }
	];

	expect(room.unaskedQuestions).toHaveLength(4);

	room.removeUnaskedQuestion('test1');

	expect(room.unaskedQuestions).toHaveLength(3);

	room.removeUnaskedQuestion('test1');

	expect(room.unaskedQuestions).toHaveLength(3);

	room.removeUnaskedQuestion('test2');

	expect(room.unaskedQuestions).toHaveLength(2);

	room.removeUnaskedQuestion('blah');

	expect(room.unaskedQuestions).toHaveLength(2);
});
