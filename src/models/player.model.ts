import QuizAnswers from './quiz/quiz-answers.model';
import Role from './role.model';

export interface PlayerInventory {
	exemption: number;
	joker: number;
	'black-exemption': number;
}

export default class Player {
	eliminated: boolean;
	isMole: boolean;
	currentRole: Role;
	quizAnswers: QuizAnswers;
	objects: PlayerInventory;

	constructor(public name: string) {
		this.eliminated = false;
		this.isMole = false;
		this.currentRole = null;
		this.quizAnswers = null;
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
