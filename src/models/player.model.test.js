import { PlayerCreator } from './player.model';

test('Checks createPlayer null value', () => {
	let nullValue = PlayerCreator.createPlayer(null);
	let { success, errors } = nullValue;
	expect(success).toBe(false);
	expect(errors.length).toBe(1);
	expect(errors[0].error).toEqual('player_data_not_given');
});

test('Checks createPlayer no name', () => {
	let nullValue = PlayerCreator.createPlayer({ name: null });
	let { success, errors } = nullValue;
	expect(success).toBe(false);
	expect(errors.length).toBe(1);
	expect(errors[0].error).toEqual('name_not_given');
});

test('Checks createPlayer success', () => {
	let playerCreate = PlayerCreator.createPlayer({ name: 'test' });
	let { success, player } = playerCreate;
	expect(success).toBe(true);
	expect(player.name).toEqual('test');
});

test('Checks createPlayer add exemptions', () => {
	let playerCreate = PlayerCreator.createPlayer({ name: 'test' });
	let { player } = playerCreate;
	player.setObjects('exemption');
	expect(player.objects['exemption']).toBe(1);
	player.setObjects('exemption', 2);
	expect(player.objects['exemption']).toBe(3);
});

test('Checks createPlayer removing exemptions', () => {
	let playerCreate = PlayerCreator.createPlayer({ name: 'test' });
	let { player } = playerCreate;
	player.objects['exemption'] = 2;
	player.removeObjects('exemption', 2);
	expect(player.objects['exemption']).toBe(0);

	player.objects['exemption'] = 2;
	player.removeObjects('exemption', 3);
	expect(player.objects['exemption']).toBe(0);
});

// TODO tests for other objects
