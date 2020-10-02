import PathChallenge from './model';
import RoomSampleService from '../../../tests/room.sample';
import '../../extensions/array';
import PathChallengeData from './data';

function getMockPathChallenge(): PathChallenge {
	let room = RoomSampleService.getTestRoomWithTenPlayers();
	let pathChallengeData = new PathChallengeData();
	let pathChallenge = pathChallengeData.getModel(room.playersStillPlaying, 'en') as PathChallenge;
	return pathChallenge;
}

test('Checks initializing challenge model', () => {
	let pathChallenge = getMockPathChallenge();
	expect(Array.isArray(pathChallenge.chests)).toBe(true);
	expect(pathChallenge.chests.length).toBe(5);

	for (let chest of pathChallenge.chests) {
		expect(chest.left === 'continue' || chest.right === 'continue').toBe(true);
	}

	expect(Array.isArray(pathChallenge.votes.left)).toBe(true);
	expect(Array.isArray(pathChallenge.votes.right)).toBe(true);
	expect(pathChallenge.votes.left.length).toBe(0);
	expect(pathChallenge.votes.right.length).toBe(0);

	expect(Array.isArray(pathChallenge.players)).toBe(true);
	expect(pathChallenge.players.length).toBe(10);

	expect(Array.isArray(pathChallenge.walkers)).toBe(true);
	expect(pathChallenge.walkers.length).toBe(9);

	let playerNamesFromRoom = pathChallenge.players.map((p) => p.name);
	expect(pathChallenge.players.length).toBe(pathChallenge.players.length);
	for (let i = 0; i < pathChallenge.players.length; i++) {
		let player = pathChallenge.players[i];
		expect(playerNamesFromRoom.indexOf(player.name) >= 0).toBe(true);
	}

	for (let i = 0; i < pathChallenge.players.length - 1; i++) {
		let walker = pathChallenge.walkers[i];
		expect(playerNamesFromRoom.indexOf(walker.name) >= 0).toBe(true);
	}

	expect(pathChallenge.players.map((p) => p.name).indexOf(pathChallenge.currentWalker.name) >= 0).toBe(true);
	expect(pathChallenge.currentChoice).toBe(null);
	expect(pathChallenge.currentChestIndex).toBe(0);
	expect(pathChallenge.state).toBe('walkerChoosing');
});

test('Checks getters/setters', () => {
	let pathChallenge = getMockPathChallenge();

	expect(typeof pathChallenge.contentsOfChosenChest).toBe('undefined');
	expect(pathChallenge.walkerIsDone).toBe(false);
	expect(pathChallenge.hasMajorityVote).toBe(false);

	pathChallenge.currentChestIndex = 0;
	pathChallenge.currentChoice = 'left';
	pathChallenge.chests = [
		{ left: 'continue', right: 'exemption' },
		{ left: 'joker', right: 'continue' },
		{ left: 'continue', right: 'black-exemption' },
		{ left: 'two jokers', right: 'continue' },
		{ left: 'three jokers', right: 'continue' }
	];

	pathChallenge.votes.left = [];
	pathChallenge.votes.left.push(pathChallenge.players[0]);
	pathChallenge.votes.left.push(pathChallenge.players[1]);
	pathChallenge.votes.left.push(pathChallenge.players[2]);
	pathChallenge.votes.left.push(pathChallenge.players[3]);

	pathChallenge.votes.right = [];
	pathChallenge.votes.right.push(pathChallenge.players[4]);
	pathChallenge.votes.right.push(pathChallenge.players[5]);
	pathChallenge.votes.right.push(pathChallenge.players[6]);
	pathChallenge.votes.right.push(pathChallenge.players[7]);
	pathChallenge.votes.right.push(pathChallenge.players[8]);
	pathChallenge.votes.right.push(pathChallenge.players[9]);

	expect(pathChallenge.hasMajorityVote).toBe(true);

	pathChallenge.votes.left = [];
	pathChallenge.votes.left.push(pathChallenge.players[0]);
	pathChallenge.votes.left.push(pathChallenge.players[1]);
	pathChallenge.votes.left.push(pathChallenge.players[2]);
	pathChallenge.votes.left.push(pathChallenge.players[3]);
	pathChallenge.votes.left.push(pathChallenge.players[4]);
	pathChallenge.votes.left.push(pathChallenge.players[5]);

	pathChallenge.votes.right = [];
	pathChallenge.votes.right.push(pathChallenge.players[6]);
	pathChallenge.votes.right.push(pathChallenge.players[7]);
	pathChallenge.votes.right.push(pathChallenge.players[8]);
	pathChallenge.votes.right.push(pathChallenge.players[9]);

	expect(pathChallenge.hasMajorityVote).toBe(true);

	pathChallenge.votes.left = [];
	pathChallenge.votes.left.push(pathChallenge.players[0]);
	pathChallenge.votes.left.push(pathChallenge.players[1]);
	pathChallenge.votes.left.push(pathChallenge.players[2]);
	pathChallenge.votes.left.push(pathChallenge.players[3]);
	pathChallenge.votes.left.push(pathChallenge.players[4]);

	pathChallenge.votes.right = [];
	pathChallenge.votes.right.push(pathChallenge.players[5]);
	pathChallenge.votes.right.push(pathChallenge.players[6]);
	pathChallenge.votes.right.push(pathChallenge.players[7]);
	pathChallenge.votes.right.push(pathChallenge.players[8]);
	pathChallenge.votes.right.push(pathChallenge.players[9]);

	expect(pathChallenge.hasMajorityVote).toBe(false);

	expect(pathChallenge.contentsOfChosenChest).toBe('continue');

	pathChallenge.currentChestIndex = 0;
	pathChallenge.currentChoice = 'right';
	expect(pathChallenge.contentsOfChosenChest).toBe('exemption');

	pathChallenge.currentChestIndex = 1;
	pathChallenge.currentChoice = 'left';
	expect(pathChallenge.contentsOfChosenChest).toBe('joker');

	pathChallenge.currentChestIndex = 1;
	pathChallenge.currentChoice = 'right';
	expect(pathChallenge.contentsOfChosenChest).toBe('continue');

	pathChallenge.currentChestIndex = 2;
	pathChallenge.currentChoice = 'left';
	expect(pathChallenge.contentsOfChosenChest).toBe('continue');

	pathChallenge.currentChestIndex = 2;
	pathChallenge.currentChoice = 'right';
	expect(pathChallenge.contentsOfChosenChest).toBe('black-exemption');

	pathChallenge.currentChestIndex = 3;
	pathChallenge.currentChoice = 'left';
	expect(pathChallenge.contentsOfChosenChest).toBe('two jokers');

	pathChallenge.currentChestIndex = 3;
	pathChallenge.currentChoice = 'right';
	expect(pathChallenge.contentsOfChosenChest).toBe('continue');

	pathChallenge.currentChestIndex = 4;
	pathChallenge.currentChoice = 'left';
	expect(pathChallenge.contentsOfChosenChest).toBe('three jokers');

	pathChallenge.currentChestIndex = 4;
	pathChallenge.currentChoice = 'right';
	expect(pathChallenge.contentsOfChosenChest).toBe('continue');

	expect(pathChallenge.walkerIsDone).toBe(false);
	pathChallenge.currentChestIndex = 5;
	expect(pathChallenge.walkerIsDone).toBe(true);
});

test('Checks walker choices', () => {
	let pathChallenge = getMockPathChallenge();

	expect(pathChallenge.currentChoice).toBe(null);

	pathChallenge.chooseLeft();

	expect(pathChallenge.currentChoice).toBe('left');

	pathChallenge.chooseRight();

	expect(pathChallenge.currentChoice).toBe('right');
});

test('Checks walker choices', () => {
	let pathChallenge = getMockPathChallenge();

	expect(pathChallenge.currentChestIndex).toBe(0);
	pathChallenge.moveToNewRow();
	expect(pathChallenge.currentChestIndex).toBe(1);
	pathChallenge.moveToNewRow();
	expect(pathChallenge.currentChestIndex).toBe(2);
	pathChallenge.moveToNewRow();
	expect(pathChallenge.currentChestIndex).toBe(3);
	pathChallenge.moveToNewRow();
	expect(pathChallenge.currentChestIndex).toBe(4);
	pathChallenge.moveToNewRow();
	expect(pathChallenge.currentChestIndex).toBe(5);
});

test('Checks addLeftVote/addRightVote', () => {
	let pathChallenge = getMockPathChallenge();

	pathChallenge.currentWalker = pathChallenge.players[0];
	pathChallenge.walkers = pathChallenge.players.slice(1, pathChallenge.players.length - 1);

	expect(pathChallenge.votes.left.length).toBe(0);
	expect(pathChallenge.votes.right.length).toBe(0);

	//current choice hasn't been set yet
	pathChallenge.addLeftVote(pathChallenge.players[1]);
	expect(pathChallenge.votes.left.length).toBe(0);

	pathChallenge.addRightVote(pathChallenge.players[1]);
	expect(pathChallenge.votes.right.length).toBe(0);

	pathChallenge.currentChoice = 'left';

	// player[0] is the walker and so cannot be voting
	pathChallenge.addLeftVote(pathChallenge.players[0]);
	expect(pathChallenge.votes.left.length).toBe(0);
	pathChallenge.addRightVote(pathChallenge.players[0]);
	expect(pathChallenge.votes.right.length).toBe(0);

	// good vote
	pathChallenge.addLeftVote(pathChallenge.players[1]);
	expect(pathChallenge.votes.left.length).toBe(1);
	pathChallenge.addRightVote(pathChallenge.players[2]);
	expect(pathChallenge.votes.right.length).toBe(1);

	// votes should swap when same player swaps their vote
	pathChallenge.votes = { left: [], right: [] };
	pathChallenge.addLeftVote(pathChallenge.players[1]);
	expect(pathChallenge.votes.left.length).toBe(1);
	expect(pathChallenge.votes.right.length).toBe(0);
	pathChallenge.addRightVote(pathChallenge.players[1]);
	expect(pathChallenge.votes.left.length).toBe(0);
	expect(pathChallenge.votes.right.length).toBe(1);
});

test('Checks setNewWalker', () => {
	let pathChallenge = getMockPathChallenge();

	pathChallenge.currentChestIndex = 1;
	pathChallenge.currentChoice = 'left';
	pathChallenge.chests = [
		{ left: 'continue', right: 'exemption' },
		{ left: 'joker', right: 'continue' },
		{ left: 'continue', right: 'black-exemption' },
		{ left: 'two jokers', right: 'continue' },
		{ left: 'three jokers', right: 'continue' }
	];

	pathChallenge.votes = {
		left: [
			pathChallenge.players[0],
			pathChallenge.players[1],
			pathChallenge.players[2],
			pathChallenge.players[3]
		],
		right: [
			pathChallenge.players[4],
			pathChallenge.players[5],
			pathChallenge.players[6],
			pathChallenge.players[7],
			pathChallenge.players[8],
			pathChallenge.players[9]
		]
	};

	pathChallenge.setNewWalker();
	expect(pathChallenge.votes.left.length).toBe(0);
	expect(pathChallenge.votes.right.length).toBe(0);
	expect(pathChallenge.currentChestIndex).toBe(0);
	expect(pathChallenge.currentChoice).toBe(null);
});
