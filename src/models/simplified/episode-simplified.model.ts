import Challenge from '../challenge.model';
import Episode, { EpisodePlayer } from '../episode.model';
import Player from '../player.model';
import Quiz from '../quiz/quiz.model';
import SimplifiedChallenge from './challenge-simplified.model';

export default class SimplifiedEpisode {
	quiz: Quiz;
	simplifiedCurrentChallenge: SimplifiedChallenge;
	eliminatedPlayer: Player;
	players: EpisodePlayer[];

	constructor(episode: Episode) {
		this.quiz = episode.quiz;
		this.eliminatedPlayer = episode.eliminatedPlayer;
		this.players = episode.players;

		this.simplifiedCurrentChallenge = episode.currentChallenge.simplifiedChallenge;
	}
}
