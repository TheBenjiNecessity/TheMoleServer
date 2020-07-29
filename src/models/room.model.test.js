import { Room } from './room.model';

test('Checks room model move next', () => {
	let room = new Room('TTTT');
	let { success, errors } = nullValue;
	expect(success).toBe(false);
	expect(errors.length).toBe(1);
	expect(errors[0].error).toEqual('player_data_not_given');
});
