import Challenge from '../../models/challenge.model';
import Riddle from '../../models/riddle.model';
import Role from '../../models/role.model';
import RiddleService from '../../services/game/riddle.service';

const type = 'wisemonkeys';
const MAX_NUM_RIDDLES = 3;

export default class WiseMonkeysChallenge extends Challenge {
	riddles: Riddle[];
	currentRiddleIndex: number;

	constructor(players, title, description, questions) {
		super(players, title, description, questions, 'game');

		this.currentRiddleIndex = 0;

		for (let i = 0; i < MAX_NUM_RIDDLES; i++) {
			this.riddles.push(RiddleService.getRandomRiddle(Riddle.RIDDLE_TYPE.WORD));
		}
	}

	get currentRiddle(): Riddle {
		return this.riddles[this.currentRiddleIndex];
	}

	get challengeIsOver(): Riddle {
		return this.riddles[this.currentRiddleIndex];
	}

	getRoles(numPlayers: number): Role[] {
		return [
			{
				name: 'See no evil',
				numPlayers: 2
			},
			{
				name: 'Hear no evil',
				numPlayers: 2
			},
			{
				name: 'Speak no evil',
				numPlayers: 2
			}
		];
	}

	goToNextRiddle() {
		this.currentRiddleIndex++;
	}

	isAnswerCorrect(answerText: string, language: string): boolean {
		return this.currentRiddle.isInputCorrent(answerText, language);
	}

	moveNext() {
		super.moveNext();
	}
}
