import PathChallenge from '../challenges/path-challenge/model';
import RoomSampleService from '../tests/room.sample';
import arrayExtensions from '../extensions/array';

arrayExtensions();

test('Checks initializing challenge model', () => {
	let room = RoomSampleService.getTestRoomWithTenPlayers();
	let pathChallenge = new PathChallenge(room.playersStillPlaying);
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

	let { playersStillPlaying } = room;
	let playerNamesFromRoom = playersStillPlaying.map((p) => p.name);
	expect(playersStillPlaying.length).toBe(pathChallenge.players.length);
	for (let i = 0; i < pathChallenge.players.length; i++) {
		let player = pathChallenge.players[i];
		expect(playerNamesFromRoom.indexOf(player.name) >= 0).toBe(true);
	}

	for (let i = 0; i < playersStillPlaying.length - 1; i++) {
		let walker = pathChallenge.walkers[i];
		expect(playerNamesFromRoom.indexOf(walker.name) >= 0).toBe(true);
	}

	expect(pathChallenge.players.map((p) => p.name).indexOf(pathChallenge.currentWalker.name) >= 0).toBe(true);
	expect(pathChallenge.currentChoice).toBe(null);
	expect(pathChallenge.currentChestIndex).toBe(0);
	expect(pathChallenge.state).toBe('walkerChoosing');
});

test('Checks getters/setters', () => {
	let room = RoomSampleService.getTestRoomWithTenPlayers();
	let pathChallenge = new PathChallenge(room.playersStillPlaying);

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
	pathChallenge.votes.left.push(room.players[0]);
	pathChallenge.votes.left.push(room.players[1]);
	pathChallenge.votes.left.push(room.players[2]);
	pathChallenge.votes.left.push(room.players[3]);

	pathChallenge.votes.right = [];
	pathChallenge.votes.right.push(room.players[4]);
	pathChallenge.votes.right.push(room.players[5]);
	pathChallenge.votes.right.push(room.players[6]);
	pathChallenge.votes.right.push(room.players[7]);
	pathChallenge.votes.right.push(room.players[8]);
	pathChallenge.votes.right.push(room.players[9]);

	expect(pathChallenge.hasMajorityVote).toBe(true);

	pathChallenge.votes.left = [];
	pathChallenge.votes.left.push(room.players[0]);
	pathChallenge.votes.left.push(room.players[1]);
	pathChallenge.votes.left.push(room.players[2]);
	pathChallenge.votes.left.push(room.players[3]);
	pathChallenge.votes.left.push(room.players[4]);
	pathChallenge.votes.left.push(room.players[5]);

	pathChallenge.votes.right = [];
	pathChallenge.votes.right.push(room.players[6]);
	pathChallenge.votes.right.push(room.players[7]);
	pathChallenge.votes.right.push(room.players[8]);
	pathChallenge.votes.right.push(room.players[9]);

	expect(pathChallenge.hasMajorityVote).toBe(true);

	pathChallenge.votes.left = [];
	pathChallenge.votes.left.push(room.players[0]);
	pathChallenge.votes.left.push(room.players[1]);
	pathChallenge.votes.left.push(room.players[2]);
	pathChallenge.votes.left.push(room.players[3]);
	pathChallenge.votes.left.push(room.players[4]);

	pathChallenge.votes.right = [];
	pathChallenge.votes.right.push(room.players[5]);
	pathChallenge.votes.right.push(room.players[6]);
	pathChallenge.votes.right.push(room.players[7]);
	pathChallenge.votes.right.push(room.players[8]);
	pathChallenge.votes.right.push(room.players[9]);

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
	let room = RoomSampleService.getTestRoomWithTenPlayers();
	let pathChallenge = new PathChallenge(room.playersStillPlaying);

	expect(pathChallenge.currentChoice).toBe(null);

	pathChallenge.chooseLeft();

	expect(pathChallenge.currentChoice).toBe('left');

	pathChallenge.chooseRight();

	expect(pathChallenge.currentChoice).toBe('right');
});

test('Checks walker choices', () => {
	let room = RoomSampleService.getTestRoomWithTenPlayers();
	let pathChallenge = new PathChallenge(room.playersStillPlaying);

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
	let room = RoomSampleService.getTestRoomWithTenPlayers();
	let pathChallenge = new PathChallenge(room.playersStillPlaying);

	pathChallenge.currentWalker = room.players[0];
	pathChallenge.walkers = room.players.slice(1, room.players.length - 1);

	expect(pathChallenge.votes.left.length).toBe(0);
	expect(pathChallenge.votes.right.length).toBe(0);

	//current choice hasn't been set yet
	pathChallenge.addLeftVote(room.players[1]);
	expect(pathChallenge.votes.left.length).toBe(0);

	pathChallenge.addRightVote(room.players[1]);
	expect(pathChallenge.votes.right.length).toBe(0);

	pathChallenge.currentChoice = 'left';

	// player[0] is the walker and so cannot be voting
	pathChallenge.addLeftVote(room.players[0]);
	expect(pathChallenge.votes.left.length).toBe(0);
	pathChallenge.addRightVote(room.players[0]);
	expect(pathChallenge.votes.right.length).toBe(0);

	// good vote
	pathChallenge.addLeftVote(room.players[1]);
	expect(pathChallenge.votes.left.length).toBe(1);
	pathChallenge.addRightVote(room.players[2]);
	expect(pathChallenge.votes.right.length).toBe(1);

	// votes should swap when same player swaps their vote
	pathChallenge.votes = { left: [], right: [] };
	pathChallenge.addLeftVote(room.players[1]);
	expect(pathChallenge.votes.left.length).toBe(1);
	expect(pathChallenge.votes.right.length).toBe(0);
	pathChallenge.addRightVote(room.players[1]);
	expect(pathChallenge.votes.left.length).toBe(0);
	expect(pathChallenge.votes.right.length).toBe(1);
});

test('Checks setNewWalker', () => {
	let room = RoomSampleService.getTestRoomWithTenPlayers();
	let pathChallenge = new PathChallenge(room.playersStillPlaying);

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
		left: [ room.players[0], room.players[1], room.players[2], room.players[3] ],
		right: [ room.players[4], room.players[5], room.players[6], room.players[7], room.players[8], room.players[9] ]
	};

	pathChallenge.setNewWalker();
	expect(pathChallenge.votes.left.length).toBe(0);
	expect(pathChallenge.votes.right.length).toBe(0);
	expect(pathChallenge.currentChestIndex).toBe(0);
	expect(pathChallenge.currentChoice).toBe(null);
});
