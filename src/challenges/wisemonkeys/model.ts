import Challenge from '../../models/challenge.model';
import Riddle from '../../models/riddle.model';
import Role from '../../models/role.model';

export default class WiseMonkeysChallenge extends Challenge {
	currentRiddleIndex: number;

	constructor(players, questions, private riddles: Riddle[]) {
		super(players, questions, 'game');

		this.currentRiddleIndex = 0;
	}

	get currentRiddle(): Riddle {
		return this.riddles[this.currentRiddleIndex];
	}

	get challengeIsOver(): boolean {
		return this.currentRiddleIndex >= this.riddles.length;
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

	isAnswerCorrect(answerText: string): boolean {
		return this.currentRiddle.isInputCorrect(answerText);
	}

	moveNext() {
		super.moveNext();
	}
}
