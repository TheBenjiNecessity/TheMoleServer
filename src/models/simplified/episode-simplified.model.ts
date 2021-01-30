import Challenge from '../challenge.model';
import Episode from '../episode.model';
import Player from '../player.model';
import Quiz from '../quiz/quiz.model';
import SimplifiedChallenge from './challenge-simplified.model';

export default class SimplifiedEpisode {
	quiz: Quiz;
	simplifiedCurrentChallenge: SimplifiedChallenge;
	eliminatedPlayer: Player;

	constructor(episode: Episode) {
		this.quiz = episode.quiz;
		this.eliminatedPlayer = episode.eliminatedPlayer;

		this.simplifiedCurrentChallenge = episode.currentChallenge.simplifiedChallenge;
	}
}
