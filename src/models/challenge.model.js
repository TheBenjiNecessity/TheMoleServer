export class Challenge {
	constructor(title, description, maxPlayers, minPlayers, questions) {
		this.title = title;
		this.description = description;
		this.maxPlayers = maxPlayers;
		this.minPlayers = minPlayers;
		this.questions = questions;
	}

	canSupportNumPlayers(numPlayers) {
		return numPlayers >= this.minPlayers && numPlayers <= this.maxPlayers;
	}
}
