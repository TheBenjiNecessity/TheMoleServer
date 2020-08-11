import Challenge, { CHALLENGE_EVENTS } from './challenge.model';
import Player from '../player.model';
import RoomService from '../../services/room/roomcode.service';

test('Checks "canSupportNumPlayers" method', () => {
	let room = RoomService.getTestRoomWithTenPlayers();
	let challenge = new Challenge(room, 'Path', 'path', '', 10, 5, [], 'game');

	expect(challenge.canSupportNumPlayers(1)).toBe(false);
	expect(challenge.canSupportNumPlayers(2)).toBe(false);
	expect(challenge.canSupportNumPlayers(3)).toBe(false);
	expect(challenge.canSupportNumPlayers(4)).toBe(false);
	expect(challenge.canSupportNumPlayers(5)).toBe(true);
	expect(challenge.canSupportNumPlayers(6)).toBe(true);
	expect(challenge.canSupportNumPlayers(7)).toBe(true);
	expect(challenge.canSupportNumPlayers(8)).toBe(true);
	expect(challenge.canSupportNumPlayers(9)).toBe(true);
	expect(challenge.canSupportNumPlayers(10)).toBe(true);
});

test('Checks "addAgreedPlayer" method', () => {
	let room = RoomService.getTestRoomWithTenPlayers();
	let challenge = new Challenge(room, 'Path', 'path', '', 10, 5, [], 'game');
	let player = new Player('test');
	challenge.addAgreedPlayer(player);

	expect(challenge.agreedPlayers.length).toBe(1);
	expect(challenge.agreedPlayers[0].name).toBe('test');

	challenge.addAgreedPlayer(player);

	expect(challenge.agreedPlayers.length).toBe(1);
	expect(challenge.agreedPlayers[0].name).toBe('test');
});

test('Checks "raiseHandForPlayer" method', () => {
	let room = RoomService.getTestRoomWithTenPlayers();
	let challenge = new Challenge(room, 'Path', 'path', '', 10, 5, [], 'game');
	challenge.raiseHandForPlayer(new Player('test'), 'test');

	expect(challenge.raisedHands.length).toBe(1);
	expect(challenge.raisedHands[0].role).toBe('test');
	expect(challenge.raisedHands[0].player.name).toBe('test');

	challenge.raiseHandForPlayer(new Player('test'), 'test');

	expect(challenge.raisedHands.length).toBe(1);
	expect(challenge.raisedHands[0].role).toBe('test');
	expect(challenge.raisedHands[0].player.name).toBe('test');

	challenge.raiseHandForPlayer(new Player('test2'), 'test2');

	expect(challenge.raisedHands.length).toBe(2);
	expect(challenge.raisedHands[1].role).toBe('test2');
	expect(challenge.raisedHands[1].player.name).toBe('test2');

	challenge.raiseHandForPlayer(new Player('test'), 'test3');

	expect(challenge.raisedHands.length).toBe(2);
	expect(challenge.raisedHands[0].role).toBe('test3');
	expect(challenge.raisedHands[0].player.name).toBe('test');
});

test('Checks "setVotedPlayer" method', () => {
	let room = RoomService.getTestRoomWithTenPlayers();
	let challenge = new Challenge(room, 'Path', 'path', '', 10, 5, [], 'game');

	challenge.setVotedPlayer(new Player('test'));
	expect(Object.keys(challenge.votedPlayers).length).toBe(1);
	expect(challenge.votedPlayers['test']).toBe(1);

	challenge.setVotedPlayer(new Player('test'));
	expect(Object.keys(challenge.votedPlayers).length).toBe(1);
	expect(challenge.votedPlayers['test']).toBe(2);

	challenge.setVotedPlayer(new Player('test1'));
	expect(Object.keys(challenge.votedPlayers).length).toBe(2);
	expect(challenge.votedPlayers['test1']).toBe(1);
});

test('Checks "removeVotedPlayer" method', () => {
	let room = RoomService.getTestRoomWithTenPlayers();
	let challenge = new Challenge(room, 'Path', 'path', '', 10, 5, [], 'game');

	challenge.setVotedPlayer(new Player('test'));
	challenge.setVotedPlayer(new Player('test'));
	challenge.setVotedPlayer(new Player('test1'));

	challenge.removeVotedPlayer(new Player('test'));

	expect(Object.keys(challenge.votedPlayers).length).toBe(2);
	expect(challenge.votedPlayers['test']).toBe(1);

	challenge.removeVotedPlayer(new Player('test1'));

	expect(Object.keys(challenge.votedPlayers).length).toBe(1);
	expect(typeof challenge.votedPlayers['test1']).toBe('undefined');
});

test('Checks "performEvent addAgreedPlayer" method', () => {
	let room = RoomService.getTestRoomWithTenPlayers();
	let challenge = new Challenge(room, 'Path', 'path', '', 10, 5, [], 'game');
	let player = new Player('test');
	challenge.performEvent(CHALLENGE_EVENTS.ADD_AGREED_PLAYER, { player, role: 'test' });

	expect(challenge.agreedPlayers.length).toBe(1);
	expect(challenge.agreedPlayers[0].name).toBe('test');

	challenge.performEvent(CHALLENGE_EVENTS.ADD_AGREED_PLAYER, { player, role: 'test' });

	expect(challenge.agreedPlayers.length).toBe(1);
	expect(challenge.agreedPlayers[0].name).toBe('test');
});

test('Checks "performEvent raiseHandForPlayer" method', () => {
	let room = RoomService.getTestRoomWithTenPlayers();
	let challenge = new Challenge(room, 'Path', 'path', '', 10, 5, [], 'game');
	let player = new Player('test');
	let player2 = new Player('test2');
	challenge.performEvent(CHALLENGE_EVENTS.RAISE_HAND_FOR_PLAYER, { player, role: 'test' });

	expect(challenge.raisedHands.length).toBe(1);
	expect(challenge.raisedHands[0].role).toBe('test');
	expect(challenge.raisedHands[0].player.name).toBe('test');

	challenge.performEvent(CHALLENGE_EVENTS.RAISE_HAND_FOR_PLAYER, { player, role: 'test' });

	expect(challenge.raisedHands.length).toBe(1);
	expect(challenge.raisedHands[0].role).toBe('test');
	expect(challenge.raisedHands[0].player.name).toBe('test');

	challenge.performEvent(CHALLENGE_EVENTS.RAISE_HAND_FOR_PLAYER, { player: player2, role: 'test2' });

	expect(challenge.raisedHands.length).toBe(2);
	expect(challenge.raisedHands[1].role).toBe('test2');
	expect(challenge.raisedHands[1].player.name).toBe('test2');

	challenge.performEvent(CHALLENGE_EVENTS.RAISE_HAND_FOR_PLAYER, { player, role: 'test3' });

	expect(challenge.raisedHands.length).toBe(2);
	expect(challenge.raisedHands[0].role).toBe('test3');
	expect(challenge.raisedHands[0].player.name).toBe('test');
});

test('Checks "performEvent setVotedPlayer" method', () => {
	let room = RoomService.getTestRoomWithTenPlayers();
	let challenge = new Challenge(room, 'Path', 'path', '', 10, 5, [], 'game');
	let player = new Player('test');
	let player1 = new Player('test1');

	challenge.performEvent(CHALLENGE_EVENTS.SET_VOTED_PLAYER, { player, role: 'test' });
	expect(Object.keys(challenge.votedPlayers).length).toBe(1);
	expect(challenge.votedPlayers['test']).toBe(1);

	challenge.performEvent(CHALLENGE_EVENTS.SET_VOTED_PLAYER, { player, role: 'test' });
	expect(Object.keys(challenge.votedPlayers).length).toBe(1);
	expect(challenge.votedPlayers['test']).toBe(2);

	challenge.performEvent(CHALLENGE_EVENTS.SET_VOTED_PLAYER, { player: player1, role: 'test1' });
	expect(Object.keys(challenge.votedPlayers).length).toBe(2);
	expect(challenge.votedPlayers['test1']).toBe(1);
});

test('Checks "performEvent removeVotedPlayer" method', () => {
	let room = RoomService.getTestRoomWithTenPlayers();
	let challenge = new Challenge(room, 'Path', 'path', '', 10, 5, [], 'game');
	let player = new Player('test');
	let player1 = new Player('test1');

	challenge.performEvent(CHALLENGE_EVENTS.SET_VOTED_PLAYER, { player, role: 'test' });
	challenge.performEvent(CHALLENGE_EVENTS.SET_VOTED_PLAYER, { player, role: 'test' });
	challenge.performEvent(CHALLENGE_EVENTS.SET_VOTED_PLAYER, { player: player1, role: 'test1' });

	challenge.performEvent(CHALLENGE_EVENTS.REMOVE_VOTED_PLAYER, { player, role: 'test' });

	expect(Object.keys(challenge.votedPlayers).length).toBe(2);
	expect(challenge.votedPlayers['test']).toBe(1);

	challenge.performEvent(CHALLENGE_EVENTS.REMOVE_VOTED_PLAYER, { player: player1, role: 'test1' });

	expect(Object.keys(challenge.votedPlayers).length).toBe(1);
	expect(typeof challenge.votedPlayers['test1']).toBe('undefined');
});
