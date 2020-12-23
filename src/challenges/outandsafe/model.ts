import Challenge from '../../models/challenge.model';

const type = 'outandsafe';

export default class OutAndSafeChallenge extends Challenge {
	currentSelectedCards: { [id: string]: string } = {};
	playerHands: { [id: string]: string[] } = {};
	currentRound: number;

	constructor(players, title, description, questions) {
		super(players, title, description, questions, 'game');

		this.currentRound = 1;

		for (let player of players) {
			this.currentSelectedCards[player.name] = null;
			this.playerHands[player.name] = [ 'safe', 'safe', 'safe', 'safe', 'out' ];
		}
	}

	get allCardsPlayed(): boolean {
		return this.currentSelectedCardsAsArray.filter((c) => c === null).length === 0;
	}

	get numOutCards(): number {
		return this.currentSelectedCardsAsArray.filter((c) => c === 'out').length;
	}

	get allCardsAreSafe(): boolean {
		return this.currentSelectedCardsAsArray.filter((c) => c === 'safe').length === this.players.length;
	}

	get currentSelectedCardsAsArray() {
		let result = [];
		for (let playerName in this.currentSelectedCards) {
			result.push(this.currentSelectedCards[playerName]);
		}
		return result;
	}

	// TODO: what if the same person tries to select more than one card per round? Allow but set last card as selected
	selectCard(playerName: string, card: string) {
		// should only be able to select safe or out cards
		if ([ 'safe', 'out' ].indexOf(card) < 0) {
			return false;
		}

		// Don't select card if player doesn't have that card
		if (typeof this.playerHands[playerName].find((c) => c === card) === 'undefined') {
			return false;
		}

		this.currentSelectedCards[playerName] = card;

		this.removeCardFromHand(playerName, card);

		return true;
	}

	removeCardFromHand(playerName: string, card: string) {
		const hand = this.playerHands[playerName];
		if (hand.find((c) => c === card)) {
			this.sortHand(playerName, card);
			this.playerHands[playerName] = this.playerHands[playerName].slice(1, this.playerHands[playerName].length);
			return true;
		}

		return false;
	}

	increaseRoundNumber() {
		this.currentRound++;
		this.clearSelectedCards();
	}

	clearSelectedCards() {
		for (let player of this.players) {
			this.currentSelectedCards[player.name] = null;
		}
	}

	private sortHand(playerName: string, type: string) {
		this.playerHands[playerName].sort((a, b) => {
			if (a === b) {
				return 0;
			} else if (a === type) {
				return -1;
			} else {
				return 1;
			}
		});
	}
}
