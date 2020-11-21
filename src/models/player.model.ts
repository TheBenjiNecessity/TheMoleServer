import QuizAnswers from './quiz/quiz-answers.model';
import Quiz from './quiz/quiz.model';
import Role from './role.model';

export interface PlayerInventory {
	exemption: number;
	joker: number;
	'black-exemption': number;
}

export default class Player {
	private _quizAnswers: QuizAnswers;

	eliminated: boolean;
	isMole: boolean;
	currentRoleName: string;
	objects: PlayerInventory;

	constructor(public name: string) {
		this.eliminated = false;
		this.isMole = false;
		this.currentRoleName = null;
		this._quizAnswers = null;
		this.objects = {
			exemption: 0,
			joker: 0,
			'black-exemption': 0
		};
	}

	get numExemptions(): number {
		return this.objects.exemption;
	}

	get numBlackExemptions(): number {
		return this.objects['black-exemption'];
	}

	get numJoker(): number {
		return this.objects.joker;
	}

	get quizAnswers() {
		return this._quizAnswers;
	}

	set quizAnswers(value: QuizAnswers) {
		this._quizAnswers = value;
		if (this.objects && value) {
			this.objects.exemption -= value.usedExemption ? 1 : 0;
			this.objects['black-exemption'] -= value.usedBlackExemption ? 1 : 0;
			this.objects.joker -= value.numJokersUsed;
		}
	}

	setObjects(object, quantity = 1) {
		if (quantity < 0) {
			return;
		}

		this.objects[object] += quantity;
	}

	removeObjects(object, quantity = 1) {
		if (quantity < 0) {
			return;
		}

		this.objects[object] -= quantity;

		if (this.objects[object] < 0) {
			this.objects[object] = 0;
		}
	}
}
