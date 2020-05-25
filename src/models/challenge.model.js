const challenges = [ new Challenge('Odd Man Out', 'P'), new Challenge('Odd Man Out', '') ];

export class Challenge {
	static challenges = challenges;

	constructor(title, description, maxPlayers, minPlayers, questions) {
		this.title = title;
		this.description = description;
		this.rules = rules;
		this.maxPlayers = maxPlayers;
		this.minPlayers = minPlayers;
		this.questions = questions;
	}

	canSupportNumPlayers(numPlayers) {
		return numPlayers >= this.minPlayers && numPlayers <= this.maxPlayers;
	}
}
