import Challenge from '../../models/challenge.model';
import Player from '../../models/player.model';
import riddles from './riddles.data';
import '../../extensions/string';
import * as _ from 'lodash';

const type = 'button';
const POINTS_PER_MINUTE = 2;

export default class ButtonChallenge extends Challenge {
	buttonPlayers: { [id: string]: { player: Player; touchingButton: boolean } };
	riddleAnswer: string;
	riddle: string;
	exemptionWasTaken: boolean;

	constructor(players, questions) {
		super(players, questions, 'game');

		let shuffledRiddles = _.shuffle(JSON.parse(JSON.stringify(riddles['en']))); // TODO lang

		this.buttonPlayers = {};
		this.riddleAnswer = shuffledRiddles[0];
		this.riddle = this.riddleAnswer.randomCypherText();
		this.exemptionWasTaken = false;

		for (let player of players) {
			this.buttonPlayers[player.name] = { player: player, touchingButton: true };
		}
	}

	get allButtonsReleased() {
		for (let player of this.players) {
			let buttonPlayer = this.buttonPlayers[player.name];
			if (buttonPlayer.touchingButton) {
				return false;
			}
		}
		return true;
	}

	get allButtonsPressed() {
		for (let player of this.players) {
			let buttonPlayer = this.buttonPlayers[player.name];
			if (!buttonPlayer.touchingButton) {
				return false;
			}
		}
		return true;
	}

	get pointsPerMinute() {
		return POINTS_PER_MINUTE;
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

	private setPlayerButtonChanged(playerName, pressed) {
		this.buttonPlayers[playerName].touchingButton = pressed;
	}
}
