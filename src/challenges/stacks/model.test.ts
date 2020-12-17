import Player from '../../models/player.model';
import Room from '../../models/room.model';
import RoomSampleService from '../../services/sample/room.sample';
import StacksChallenge, { IPilesGenerator, Pile } from './model';

class PilesGenerator implements IPilesGenerator {
	constructor() {}

	generatePiles(players: Player[]): { [id: string]: Pile } {
		let piles: { [id: string]: Pile } = {};

		piles[players[0].name] = { player: players[0], amount: -5, numSelected: 0 };
		piles[players[1].name] = { player: players[1], amount: -3, numSelected: 0 };
		piles[players[2].name] = { player: players[2], amount: -1, numSelected: 0 };
		piles[players[3].name] = { player: players[3], amount: 1, numSelected: 0 };
		piles[players[4].name] = { player: players[4], amount: 3, numSelected: 0 };
		piles[players[5].name] = { player: players[5], amount: 5, numSelected: 0 };

		return piles;
	}
}

function getMockStacksChallenge(room: Room): StacksChallenge {
	return new StacksChallenge(room.playersStillPlaying, '', '', [], new PilesGenerator());
}

function getMockComponents() {
	let room = RoomSampleService.getTestRoomForNumPlayers(6);
	let stacksChallenge = getMockStacksChallenge(room);
	return { room, stacksChallenge };
}

test('Checks initializing StacksChallenge model', () => {
	let { room, stacksChallenge } = getMockComponents();

	expect(stacksChallenge.currentRound).toBe(1);
	expect(stacksChallenge.allStackAmountsSelected).toBe(false);

	for (let player of room.playersStillPlaying) {
		let pile = stacksChallenge.piles[player.name];
		expect(pile.numSelected).toBe(0);
		expect(pile.player).toEqual(player);
		expect([ 5, 3, 1, -1, -3, -5 ].indexOf(pile.amount) >= 0).toBe(true);
	}
});

test('Checks allStackAmountsSelected getter', () => {
	let { room, stacksChallenge } = getMockComponents();

	expect(stacksChallenge.allStackAmountsSelected).toBe(false);

	for (let player of room.playersStillPlaying) {
		stacksChallenge.selectNumberOfTilesForPlayer(player.name, 1);
	}

	expect(stacksChallenge.allStackAmountsSelected).toBe(true);
});

test('Checks pointsForRound getter', () => {
	let { room, stacksChallenge } = getMockComponents();

	expect(stacksChallenge.pointsForRound).toBe(0);

	for (let player of room.playersStillPlaying) {
		stacksChallenge.selectNumberOfTilesForPlayer(player.name, 1);
	}

	expect(stacksChallenge.pointsForRound).toBe(0);

	stacksChallenge.resetPiles();

	expect(stacksChallenge.pointsForRound).toBe(0);

	stacksChallenge.selectNumberOfTilesForPlayer(room.playersStillPlaying[0].name, 1);
	stacksChallenge.selectNumberOfTilesForPlayer(room.playersStillPlaying[1].name, 1);
	stacksChallenge.selectNumberOfTilesForPlayer(room.playersStillPlaying[2].name, 1);
	stacksChallenge.selectNumberOfTilesForPlayer(room.playersStillPlaying[3].name, 2);
	stacksChallenge.selectNumberOfTilesForPlayer(room.playersStillPlaying[4].name, 2);
	stacksChallenge.selectNumberOfTilesForPlayer(room.playersStillPlaying[5].name, 3);

	expect(stacksChallenge.pointsForRound).toBe(5);
});

test('Checks isChallengeOver getter', () => {
	let { room, stacksChallenge } = getMockComponents();

	expect(stacksChallenge.isChallengeOver).toBe(false);
	stacksChallenge.goToNextRound();
	expect(stacksChallenge.isChallengeOver).toBe(false);
	stacksChallenge.goToNextRound();
	expect(stacksChallenge.isChallengeOver).toBe(false);
	stacksChallenge.goToNextRound();
	expect(stacksChallenge.isChallengeOver).toBe(true);
});

test('Checks goToNextRound method', () => {
	let { room, stacksChallenge } = getMockComponents();

	expect(stacksChallenge.currentRound).toBe(1);
	stacksChallenge.goToNextRound();
	expect(stacksChallenge.currentRound).toBe(2);
	stacksChallenge.goToNextRound();
	expect(stacksChallenge.currentRound).toBe(3);
	stacksChallenge.goToNextRound();
	expect(stacksChallenge.currentRound).toBe(4);
});

test('Checks resetPiles method', () => {
	let { room, stacksChallenge } = getMockComponents();

	stacksChallenge.piles[room.playersStillPlaying[0].name] = {
		player: room.playersStillPlaying[0],
		numSelected: 1,
		amount: 5
	};
	stacksChallenge.piles[room.playersStillPlaying[1].name] = {
		player: room.playersStillPlaying[1],
		numSelected: 2,
		amount: 3
	};
	stacksChallenge.piles[room.playersStillPlaying[2].name] = {
		player: room.playersStillPlaying[2],
		numSelected: 2,
		amount: 1
	};
	stacksChallenge.piles[room.playersStillPlaying[3].name] = {
		player: room.playersStillPlaying[3],
		numSelected: 1,
		amount: -1
	};
	stacksChallenge.piles[room.playersStillPlaying[4].name] = {
		player: room.playersStillPlaying[4],
		numSelected: 3,
		amount: -3
	};
	stacksChallenge.piles[room.playersStillPlaying[5].name] = {
		player: room.playersStillPlaying[5],
		numSelected: 3,
		amount: -5
	};

	for (let player of room.playersStillPlaying) {
		expect(stacksChallenge.piles[player.name].numSelected > 0).toBe(true);
	}

	stacksChallenge.resetPiles();

	for (let player of room.playersStillPlaying) {
		expect(stacksChallenge.piles[player.name].numSelected).toBe(0);
	}
});

test('Checks selectNumberOfTilesForPlayer method', () => {
	let { room, stacksChallenge } = getMockComponents();

	for (let player of room.playersStillPlaying) {
		expect(stacksChallenge.piles[player.name].numSelected).toBe(0);
	}

	stacksChallenge.selectNumberOfTilesForPlayer(room.playersStillPlaying[0].name, 1);
	expect(stacksChallenge.piles[room.playersStillPlaying[0].name].numSelected).toBe(1);

	stacksChallenge.selectNumberOfTilesForPlayer(room.playersStillPlaying[1].name, 2);
	expect(stacksChallenge.piles[room.playersStillPlaying[1].name].numSelected).toBe(2);

	stacksChallenge.selectNumberOfTilesForPlayer(room.playersStillPlaying[2].name, 3);
	expect(stacksChallenge.piles[room.playersStillPlaying[2].name].numSelected).toBe(3);

	stacksChallenge.selectNumberOfTilesForPlayer(room.playersStillPlaying[3].name, 1);
	expect(stacksChallenge.piles[room.playersStillPlaying[3].name].numSelected).toBe(1);

	stacksChallenge.selectNumberOfTilesForPlayer(room.playersStillPlaying[4].name, 2);
	expect(stacksChallenge.piles[room.playersStillPlaying[4].name].numSelected).toBe(2);

	stacksChallenge.selectNumberOfTilesForPlayer(room.playersStillPlaying[5].name, 3);
	expect(stacksChallenge.piles[room.playersStillPlaying[5].name].numSelected).toBe(3);
});
