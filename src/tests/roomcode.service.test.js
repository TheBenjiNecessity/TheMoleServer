import RoomService, { MAX_LETTERS, BAD_WORDS } from '../services/room/room.service';

const ROOMCODE_REGEX = /[A-Z]{4}/;

test('Checks "generateRandomRoomcode" method', () => {
	let roomcode = RoomService.generateRandomRoomcode();
	expect(roomcode.length).toBe(MAX_LETTERS);
	expect(ROOMCODE_REGEX.test(roomcode)).toBe(true);
});

test('Checks "roomCodeIsABadWord" method', () => {
	expect(RoomService.roomCodeIsABadWord('TEST')).toBe(false);
	for (let word of BAD_WORDS) {
		expect(RoomService.roomCodeIsABadWord(word)).toBe(true);
	}
});
