import { Challenge } from './challenge.model';
import { Quiz } from './quiz.model';

export class Episode {
    challenges = [];
    quiz = null;
    numPlayers = -1;

    constructor(numPlayers, challenges, quiz) {
        this.challenges = challenges;
        this.quiz = quiz;
        this.numPlayers = numPlayers;
    }
}