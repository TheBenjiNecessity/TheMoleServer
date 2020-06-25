import { Question } from '../question.model';
import Challenge from './challenge.model';

const title = 'The Cloche';
const type = 'platter';
const description = 'description';
const questions = [ new Question('In the "Cloche" challenge, did the mole take the exemption?') ];

export class PlatterChallenge extends Challenge {
	constructor() {
		super(title, type, description, 10, 5, questions);
		this.state = 'game';
	}
}
