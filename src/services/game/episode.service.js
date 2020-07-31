import { Episode } from '../../models/episode.model';
import ChallengeService from './challenge.service';

export default class EpisodeService {
	constructor() {}

	static getEpisodes(numPlayers) {
		let episodes = [];
		let challenges = [];
		for (let i = numPlayers; i >= 2; i--) {
			let episode = this.getEpisode(numPlayers, i, challenges);
			challenges = challenges.concat(episode.challenges);
			episodes.push(episode);
		}

		return episodes;
	}

	static getEpisode(numAllPlayers, numPlayers, currentChallenges) {
		if (numPlayers === 2) {
			return new Episode(
				numPlayers,
				ChallengeService.getRandomChallengeForPlayers(numPlayers, currentChallenges)
			);
		} else {
			let challenges = [];
			let numChallengesPerEpisode = this.getNumChallenges(numAllPlayers);
			for (let i = 0; i < numChallengesPerEpisode; i++) {
				challenges.push(ChallengeService.getRandomChallengeForPlayers(numPlayers, currentChallenges));
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
