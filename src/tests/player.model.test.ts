import Player from '../models/player.model';

let player: Player = null;
beforeEach(() => {
	player = new Player('test');
});

test('Checks player', () => {
	expect(player.name).toEqual('test');
	expect(player.objects['exemption']).toBe(0);
	expect(player.objects['joker']).toBe(0);
	expect(player.objects['black-exemption']).toBe(0);
});

test('Checks add exemptions', () => {
	player.setObjects('exemption');
	expect(player.objects['exemption']).toBe(1);
	player.setObjects('exemption', 2);
	expect(player.objects['exemption']).toBe(3);
});

test('Checks removing exemptions', () => {
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
	player.setObjects('joker');
	expect(player.objects['joker']).toBe(1);
	player.setObjects('joker', 2);
	expect(player.objects['joker']).toBe(3);
});

test('Checks removing jokers', () => {
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
	player.setObjects('black-exemption');
	expect(player.objects['black-exemption']).toBe(1);
	player.setObjects('black-exemption', 2);
	expect(player.objects['black-exemption']).toBe(3);
});

test('Checks removing black exemptions', () => {
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

test('Checks numExemptions getter', () => {
	expect(player.numExemptions).toBe(0);

	player.objects = {
		exemption: 1,
		joker: 0,
		'black-exemption': 0
	};

	expect(player.numExemptions).toBe(1);
});

test('Checks numBlackExemptions getter', () => {
	expect(player.numBlackExemptions).toBe(0);

	player.objects = {
		exemption: 0,
		joker: 0,
		'black-exemption': 1
	};

	expect(player.numBlackExemptions).toBe(1);
});

test('Checks numJoker getter', () => {
	expect(player.numJoker).toBe(0);

	player.objects = {
		exemption: 0,
		joker: 1,
		'black-exemption': 0
	};

	expect(player.numJoker).toBe(1);
});

test('Checks setObjects setter', () => {
	expect(player.objects.joker).toBe(0);

	player.setObjects('joker', -1);

	expect(player.objects.joker).toBe(0);

	player.setObjects('joker', 1);

	expect(player.objects.joker).toBe(1);

	player.setObjects('joker', 1);

	expect(player.objects.joker).toBe(2);

	expect(player.objects.exemption).toBe(0);

	player.setObjects('exemption', -1);

	expect(player.objects.exemption).toBe(0);

	player.setObjects('exemption', 1);

	expect(player.objects.exemption).toBe(1);

	player.setObjects('exemption', 1);

	expect(player.objects.exemption).toBe(2);

	expect(player.objects['black-exemption']).toBe(0);

	player.setObjects('black-exemption', -1);

	expect(player.objects['black-exemption']).toBe(0);

	player.setObjects('black-exemption', 1);

	expect(player.objects['black-exemption']).toBe(1);

	player.setObjects('black-exemption', 1);

	expect(player.objects['black-exemption']).toBe(2);
});

test('Checks removeObjects setter', () => {
	expect(player.objects.joker).toBe(0);

	player.removeObjects('joker', -1);

	expect(player.objects.joker).toBe(0);

	player.removeObjects('joker', 1);

	expect(player.objects.joker).toBe(0);

	player.objects.joker = 2;

	player.removeObjects('joker', 1);

	expect(player.objects.joker).toBe(1);

	expect(player.objects.exemption).toBe(0);

	player.removeObjects('exemption', -1);

	expect(player.objects.exemption).toBe(0);

	player.removeObjects('exemption', 1);

	expect(player.objects.exemption).toBe(0);

	player.objects.exemption = 2;

	player.removeObjects('exemption', 1);

	expect(player.objects.exemption).toBe(1);

	expect(player.objects['black-exemption']).toBe(0);

	player.removeObjects('black-exemption', -1);

	expect(player.objects['black-exemption']).toBe(0);

	player.removeObjects('black-exemption', 1);

	expect(player.objects['black-exemption']).toBe(0);

	player.objects['black-exemption'] = 2;

	player.removeObjects('black-exemption', 1);

	expect(player.objects['black-exemption']).toBe(1);
});
