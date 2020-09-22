import Challenge from '../../models/challenge.model';
import * as riddles from './riddles.data';

const type = 'button';

export default class ButtonChallenge extends Challenge {
	constructor(players, title, description, maxPlayers, minPlayers, questions, initialState) {
		super(players, title, description, maxPlayers, minPlayers, questions, initialState, [], type);

		this.buttonPlayers = {};
		this.riddleAnswer = riddles.shuffle()[0];
		this.riddle = this.riddleAnswer.randomCypherText();
		this.exemptionWasTaken = false;

		for (let player of players) {
			this.buttonPlayers[player.name] = { player: p, touchingButton: true };
		}
	}

	get allButtonsReleased() {
		return this.buttonPlayers.every((bp) => !bp.touchingButton);
	}

	get allButtonsPressed() {
		return this.buttonPlayers.every((bp) => bp.touchingButton);
	}

	isPlayerAnswerCorrect(answer) {
		let sanitizedAnswer = answer.toLowerCase().replace(/[^a-z ]/g, '');
		let sanitizedRiddle = this.riddleAnswer.toLowerCase().replace(/[^a-z ]/g, '');

		return sanitizedAnswer === sanitizedRiddle;
	}

	setPlayerReleasedButton(playerName) {
		this.setPlayerButtonChanged(playerName, false);
	}

	setPlayerPressedButton(playerName) {
		this.setPlayerButtonChanged(playerName, true);
	}

	setPlayerButtonChanged(playerName, pressed) {
		this.buttonPlayers[playerName].touchingButton = pressed;
	}
}
