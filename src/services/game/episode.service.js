import { Episode } from '../../models/episode.model';
import { ChallengeService } from './challenge.service';

export class EpisodeService {
	constructor() {
		this.challengeService = new ChallengeService();
	}

	getEpisodes(numPlayers) {
		let episodes = [];
		for (let i = numPlayers; i >= 2; i--) {
			episodes.push(this.getEpisode(i));
		}

		return episodes;
	}

	getEpisode(numPlayers) {
		let challenges = [];
		let numChallengesPerEpisode = this.getNumChallenges(numPlayers);
		for (let i = 0; i < numChallengesPerEpisode; i++) {
			challenges.push(this.challengeService.getChallenge(numPlayers));
		}
		return new Episode(numPlayers, challenges);
	}

	getNumChallenges(numPlayers) {
		switch (numPlayers) {
			case 10:
			case 9:
			case 8:
			case 7:
				return 3;
			case 6:
			case 5:
			case 4:
				return 4;
			default:
				return 0;
		}
	}

	getQuiz() {}
}
