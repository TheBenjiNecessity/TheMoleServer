class Player {
	constructor(name) {
		this.name = name;
		this.objects = {
			exemption: 0,
			joker: 0,
			'black-exemption': 0
		};
	}

	getObjects(object, quantity = 1) {
		this.objects[object] += quantity;
	}

	removeObjects(object, quantity = 1) {
		this.objects[object] -= quantity;

		if (this.objects[object] < 0) {
			this.objects[object] = 0;
		}
	}
}

export class PlayerCreator {
	constructor() {}

	static createPlayer(player) {
		if (!player) {
			return {
				success: false,
				errors: [ { error: 'player_data_not_given' } ]
			};
		}

		if (!player.name) {
			return {
				success: false,
				errors: [ { error: 'name_not_given' } ]
			};
		}

		return {
			success: true,
			player: new Player(player.name)
		};
	}
}
