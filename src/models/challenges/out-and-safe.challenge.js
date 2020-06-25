import { Question } from '../question.model';
import Challenge from './challenge.model';

const title = 'Out/Safe';
const type = 'out-and-safe';
const description = 'description';
const questions = [ new Question('During the "Out and Safe" challenge, did the mole play an out card?') ];

export class OutAndSafeChallenge extends Challenge {
	constructor() {
		super(title, type, description, 5, 5, questions);
	}
}
