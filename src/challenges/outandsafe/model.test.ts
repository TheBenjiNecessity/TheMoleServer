import RoomSampleService from '../../models/samples/room.sample';
import OutAndSafeChallengeData from './data';
import OutAndSafeChallenge from './model';

test('Checks initializing of model', () => {
	let numPlayers = 5;
	let room = RoomSampleService.getTestRoomForNumPlayers(numPlayers);
	let outAndSafeChallenge = new OutAndSafeChallengeData().getModel(
		room.playersStillPlaying,
		'en'
	) as OutAndSafeChallenge;

	expect(outAndSafeChallenge.currentRound).toBe(1);
	expect(Object.keys(outAndSafeChallenge.playerHands).length).toBe(numPlayers);
	for (let playerName of Object.keys(outAndSafeChallenge.playerHands)) {
		const hand = outAndSafeChallenge.playerHands[playerName];
		const card = outAndSafeChallenge.currentSelectedCards[playerName];
		expect(hand).toEqual([ 'safe', 'safe', 'safe', 'safe', 'out' ]);
		expect(card).toBe(null);
	}
});

test("Checks removing of 'safe' card from player's hand", () => {
	let room = RoomSampleService.getTestRoomForNumPlayers(5);
	let outAndSafeChallenge = new OutAndSafeChallengeData().getModel(
		room.playersStillPlaying,
		'en'
	) as OutAndSafeChallenge;
	let firstPlayerName = room.playersStillPlaying[0].name;
	outAndSafeChallenge.removeCardFromHand(firstPlayerName, 'safe');

	expect(outAndSafeChallenge.playerHands[firstPlayerName].length).toBe(4);
	expect(outAndSafeChallenge.playerHands[firstPlayerName].filter((c) => c === 'safe').length).toEqual(3);
	expect(outAndSafeChallenge.playerHands[firstPlayerName].filter((c) => c === 'out').length).toEqual(1);

	for (let i = 1; i < room.playersStillPlaying.length; i++) {
		let playerName = room.playersStillPlaying[i].name;
		expect(outAndSafeChallenge.playerHands[playerName].length).toBe(5);
		expect(outAndSafeChallenge.playerHands[playerName].filter((c) => c === 'safe').length).toEqual(4);
		expect(outAndSafeChallenge.playerHands[playerName].filter((c) => c === 'out').length).toEqual(1);
	}
});

test("Checks removing of 'out' card from player's hand", () => {
	let room = RoomSampleService.getTestRoomForNumPlayers(5);
	let outAndSafeChallenge = new OutAndSafeChallengeData().getModel(
		room.playersStillPlaying,
		'en'
	) as OutAndSafeChallenge;
	let firstPlayerName = room.playersStillPlaying[0].name;
	outAndSafeChallenge.removeCardFromHand(firstPlayerName, 'out');

	expect(outAndSafeChallenge.playerHands[firstPlayerName].length).toBe(4);
	expect(outAndSafeChallenge.playerHands[firstPlayerName].filter((c) => c === 'safe').length).toEqual(4);
	expect(outAndSafeChallenge.playerHands[firstPlayerName].filter((c) => c === 'out').length).toEqual(0);

	for (let i = 1; i < room.playersStillPlaying.length; i++) {
		let playerName = room.playersStillPlaying[i].name;
		expect(outAndSafeChallenge.playerHands[playerName].length).toBe(5);
		expect(outAndSafeChallenge.playerHands[playerName].filter((c) => c === 'safe').length).toEqual(4);
		expect(outAndSafeChallenge.playerHands[playerName].filter((c) => c === 'out').length).toEqual(1);
	}
});

test('Checks increaseRoundNumber method', () => {
	let room = RoomSampleService.getTestRoomForNumPlayers(5);
	let outAndSafeChallenge = new OutAndSafeChallengeData().getModel(
		room.playersStillPlaying,
		'en'
	) as OutAndSafeChallenge;

	expect(outAndSafeChallenge.currentRound).toBe(1);
	outAndSafeChallenge.increaseRoundNumber();
	expect(outAndSafeChallenge.currentRound).toBe(2);
});

test('Checks clearSelectedCards method', () => {
	let room = RoomSampleService.getTestRoomForNumPlayers(5);
	let outAndSafeChallenge = new OutAndSafeChallengeData().getModel(
		room.playersStillPlaying,
		'en'
	) as OutAndSafeChallenge;
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[0].name] = 'safe';
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[1].name] = 'safe';
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[2].name] = 'safe';

	outAndSafeChallenge.clearSelectedCards();
	for (let card of outAndSafeChallenge.currentSelectedCardsAsArray) {
		expect(card).toBe(null);
	}
});

test('Checks selectCard method', () => {
	let room = RoomSampleService.getTestRoomForNumPlayers(5);
	let outAndSafeChallenge = new OutAndSafeChallengeData().getModel(
		room.playersStillPlaying,
		'en'
	) as OutAndSafeChallenge;
	let player1Name = room.playersStillPlaying[0].name;
	let player2Name = room.playersStillPlaying[1].name;

	let blahTest = outAndSafeChallenge.selectCard(player1Name, 'blah');
	expect(blahTest).toBe(false);
	expect(outAndSafeChallenge.playerHands[player1Name].length).toBe(5);
	expect(outAndSafeChallenge.playerHands[player1Name].filter((c) => c === 'safe').length).toBe(4);
	expect(outAndSafeChallenge.playerHands[player1Name].filter((c) => c === 'out').length).toBe(1);

	let safeTest = outAndSafeChallenge.selectCard(player1Name, 'safe');
	expect(safeTest).toBe(true);
	expect(outAndSafeChallenge.playerHands[player1Name].length).toBe(4);
	expect(outAndSafeChallenge.playerHands[player1Name].filter((c) => c === 'safe').length).toBe(3);
	expect(outAndSafeChallenge.playerHands[player1Name].filter((c) => c === 'out').length).toBe(1);

	let outTest = outAndSafeChallenge.selectCard(player2Name, 'out');
	expect(outTest).toBe(true);
	expect(outAndSafeChallenge.playerHands[player2Name].length).toBe(4);
	expect(outAndSafeChallenge.playerHands[player2Name].filter((c) => c === 'safe').length).toBe(4);
	expect(outAndSafeChallenge.playerHands[player2Name].filter((c) => c === 'out').length).toBe(0);

	let outTest2 = outAndSafeChallenge.selectCard(player2Name, 'out');
	expect(outTest2).toBe(false);
	expect(outAndSafeChallenge.playerHands[player2Name].length).toBe(4);
	expect(outAndSafeChallenge.playerHands[player2Name].filter((c) => c === 'safe').length).toBe(4);
	expect(outAndSafeChallenge.playerHands[player2Name].filter((c) => c === 'out').length).toBe(0);
});

test('Checks allCardsPlayed getter', () => {
	let room = RoomSampleService.getTestRoomForNumPlayers(5);
	let outAndSafeChallenge = new OutAndSafeChallengeData().getModel(
		room.playersStillPlaying,
		'en'
	) as OutAndSafeChallenge;

	expect(outAndSafeChallenge.allCardsPlayed).toBe(false);
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[0].name] = 'safe';
	expect(outAndSafeChallenge.allCardsPlayed).toBe(false);
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[1].name] = 'safe';
	expect(outAndSafeChallenge.allCardsPlayed).toBe(false);
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[2].name] = 'safe';
	expect(outAndSafeChallenge.allCardsPlayed).toBe(false);
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[3].name] = 'safe';
	expect(outAndSafeChallenge.allCardsPlayed).toBe(false);
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[4].name] = 'safe';
	expect(outAndSafeChallenge.allCardsPlayed).toBe(true);
});

test('Checks numOutCards getter', () => {
	let room = RoomSampleService.getTestRoomForNumPlayers(5);
	let outAndSafeChallenge = new OutAndSafeChallengeData().getModel(
		room.playersStillPlaying,
		'en'
	) as OutAndSafeChallenge;

	expect(outAndSafeChallenge.numOutCards).toBe(0);
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[0].name] = 'out';
	expect(outAndSafeChallenge.numOutCards).toBe(1);
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[1].name] = 'out';
	expect(outAndSafeChallenge.numOutCards).toBe(2);
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[2].name] = 'out';
	expect(outAndSafeChallenge.numOutCards).toBe(3);
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[3].name] = 'out';
	expect(outAndSafeChallenge.numOutCards).toBe(4);
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[4].name] = 'out';
	expect(outAndSafeChallenge.numOutCards).toBe(5);
});

test('Checks allCardsAreSafe getter', () => {
	let room = RoomSampleService.getTestRoomForNumPlayers(5);
	let outAndSafeChallenge = new OutAndSafeChallengeData().getModel(
		room.playersStillPlaying,
		'en'
	) as OutAndSafeChallenge;

	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[0].name] = 'safe';
	expect(outAndSafeChallenge.allCardsAreSafe).toBe(false);
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[1].name] = 'safe';
	expect(outAndSafeChallenge.allCardsAreSafe).toBe(false);
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[2].name] = 'safe';
	expect(outAndSafeChallenge.allCardsAreSafe).toBe(false);
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[3].name] = 'safe';
	expect(outAndSafeChallenge.allCardsAreSafe).toBe(false);
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[4].name] = 'safe';
	expect(outAndSafeChallenge.allCardsAreSafe).toBe(true);
});

test('Checks currentSelectedCardsAsArray getter', () => {
	let room = RoomSampleService.getTestRoomForNumPlayers(5);
	let outAndSafeChallenge = new OutAndSafeChallengeData().getModel(
		room.playersStillPlaying,
		'en'
	) as OutAndSafeChallenge;
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[0].name] = 'safe';
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[1].name] = 'safe';
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[2].name] = 'safe';
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[3].name] = 'safe';
	outAndSafeChallenge.currentSelectedCards[room.playersStillPlaying[4].name] = 'safe';
	expect(outAndSafeChallenge.currentSelectedCardsAsArray).toEqual([ 'safe', 'safe', 'safe', 'safe', 'safe' ]);
});
