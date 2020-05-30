class Player {
	constructor(name) {
		this.name = name;
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
