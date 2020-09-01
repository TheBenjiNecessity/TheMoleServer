import Player from '../models/player.model';

test('Checks player', () => {
	let player = new Player('test');

	expect(player.name).toEqual('test');
	expect(player.objects['exemption']).toBe(0);
	expect(player.objects['joker']).toBe(0);
	expect(player.objects['black-exemption']).toBe(0);
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
	player.removeObjects('exemption', 1);
	expect(player.objects['exemption']).toBe(1);

	player.objects['exemption'] = 2;
	player.removeObjects('exemption', 2);
	expect(player.objects['exemption']).toBe(0);

	player.objects['exemption'] = 2;
	player.removeObjects('exemption', 3);
	expect(player.objects['exemption']).toBe(0);
});

test('Checks add jokers', () => {
	let player = new Player('test');

	player.setObjects('joker');
	expect(player.objects['joker']).toBe(1);
	player.setObjects('joker', 2);
	expect(player.objects['joker']).toBe(3);
});

test('Checks removing jokers', () => {
	let player = new Player('test');

	player.objects['joker'] = 2;
	player.removeObjects('joker', 1);
	expect(player.objects['joker']).toBe(1);

	player.objects['joker'] = 2;
	player.removeObjects('joker', 2);
	expect(player.objects['joker']).toBe(0);

	player.objects['joker'] = 2;
	player.removeObjects('joker', 3);
	expect(player.objects['joker']).toBe(0);
});

test('Checks add black exemptions', () => {
	let player = new Player('test');
	player.setObjects('black-exemption');
	expect(player.objects['black-exemption']).toBe(1);
	player.setObjects('black-exemption', 2);
	expect(player.objects['black-exemption']).toBe(3);
});

test('Checks removing black exemptions', () => {
	let player = new Player('test');

	player.objects['black-exemption'] = 2;
	player.removeObjects('black-exemption', 1);
	expect(player.objects['black-exemption']).toBe(1);

	player.objects['black-exemption'] = 2;
	player.removeObjects('black-exemption', 2);
	expect(player.objects['black-exemption']).toBe(0);

	player.objects['black-exemption'] = 2;
	player.removeObjects('black-exemption', 3);
	expect(player.objects['black-exemption']).toBe(0);
});
