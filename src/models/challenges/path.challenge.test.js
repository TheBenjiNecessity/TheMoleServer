import PathChallenge from './path.challenge';
import Room from '../room.model';

test('Checks getters/setters', () => {
	let room = Room.getTestRoomWithTenPlayers();
	let pathChallenge = new PathChallenge(room);

	expect(typeof pathChallenge.contentsOfChosenChest).toBe('undefined');
	expect(pathChallenge.walkerIsDone).toBe(false);
	expect(pathChallenge.majorityVote).toBe(null);

	for (let chest of pathChallenge.chests) {
		expect(chest.left === 'continue' || chest.right === 'continue').toBe(true);
	}

	pathChallenge.currentChestIndex = 0;
	pathChallenge.currentChoice = 'left';
	pathChallenge.chests = [
		{ left: 'continue', right: 'exemption' },
		{ left: 'joker', right: 'continue' },
		{ left: 'continue', right: 'black-exemption' },
		{ left: 'two jokers', right: 'continue' },
		{ left: 'three jokers', right: 'continue' }
	];

	expect(pathChallenge.majorityVote).toBe(null);

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

	expect(pathChallenge.majorityVote).toBe('right');

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

	expect(pathChallenge.majorityVote).toBe('left');

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

	expect(pathChallenge.majorityVote).toBe(null);

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
	let room = Room.getTestRoomWithTenPlayers();
	let pathChallenge = new PathChallenge(room);

	expect(pathChallenge.currentChoice).toBe(null);

	pathChallenge.chooseLeft();

	expect(pathChallenge.currentChoice).toBe('left');

	pathChallenge.chooseRight();

	expect(pathChallenge.currentChoice).toBe('right');
});

test('Checks walker choices', () => {
	let room = Room.getTestRoomWithTenPlayers();
	let pathChallenge = new PathChallenge(room);

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
	let room = Room.getTestRoomWithTenPlayers();
	let pathChallenge = new PathChallenge(room);

	expect(pathChallenge.votes.left.length).toBe(0);
	expect(pathChallenge.votes.right.length).toBe(0);

	pathChallenge.addLeftVote(room.players[0]);
	pathChallenge.addRightVote(room.players[1]);

	expect(pathChallenge.votes.left.length).toBe(1);
	expect(pathChallenge.votes.right.length).toBe(1);
	expect(pathChallenge.votes.left[0].name).toBe(room.players[0].name);
	expect(pathChallenge.votes.right[0].name).toBe(room.players[1].name);

	pathChallenge.addRightVote(room.players[0]);

	expect(pathChallenge.votes.left.length).toBe(0);
	expect(pathChallenge.votes.right.length).toBe(2);
	expect(pathChallenge.votes.right[0].name).toBe(room.players[1].name);
	expect(pathChallenge.votes.right[1].name).toBe(room.players[0].name);
});

test('Checks setNewWalker', () => {
	let room = Room.getTestRoomWithTenPlayers();
	let pathChallenge = new PathChallenge(room);

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
