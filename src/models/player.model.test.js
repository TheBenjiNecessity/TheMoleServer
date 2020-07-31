import Player from './player.model';

test('Checks player', () => {
	let player = new Player('test');
	expect(player.name).toEqual('test');
});

test('Checks add exemptions', () => {
	let player = new Player('test');
	player.setObjects('exemption');
	expect(player.objects['exemption']).toBe(1);
	player.setObjects('exemption', 2);
	expect(player.objects['exemption']).toBe(3);
});

test('Checks removing exemptions', () => {
	let player = new Player('test');
	player.objects['exemption'] = 2;
	player.removeObjects('exemption', 2);
	expect(player.objects['exemption']).toBe(0);

	player.objects['exemption'] = 2;
	player.removeObjects('exemption', 3);
	expect(player.objects['exemption']).toBe(0);
});

// TODO tests for other objects
