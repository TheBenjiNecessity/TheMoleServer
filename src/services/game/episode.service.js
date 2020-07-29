import { Episode } from '../../models/episode.model';
import ChallengeService from './challenge.service';

export default class EpisodeService {
	constructor() {
		this.challengeService = new ChallengeService();
	}

	static getEpisodes(numPlayers) {
		let episodes = [];
		for (let i = numPlayers; i >= 2; i--) {
			episodes.push(this.getEpisode(numPlayers, i));
		}

		return episodes;
	}

	static getEpisode(numAllPlayers, numPlayers) {
		if (numPlayers === 2) {
			return new Episode(numPlayers, this.challengeService.getRandomChallengeForPlayers(numPlayers));
		} else {
			let challenges = [];
			let numChallengesPerEpisode = this.getNumChallenges(numAllPlayers);
			for (let i = 0; i < numChallengesPerEpisode; i++) {
				challenges.push(this.challengeService.getRandomChallengeForPlayers(numPlayers));
			}
			return new Episode(numPlayers, challenges);
		}
	}

	static getNumChallenges(numPlayers) {
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
