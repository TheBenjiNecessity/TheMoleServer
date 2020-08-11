import { Episode } from '../../models/episode.model';
import ChallengeService from './challenge.service';

export default class EpisodeService {
	constructor() {}

	static generateEpisodes(room) {
		let episodes = [];
		let challenges = [];
		let numChallengesPerEpisode = EpisodeService.getNumChallenges(room.players.length);
		for (let numPlayers = numChallengesPerEpisode; numPlayers >= 2; numPlayers--) {
			let episode = this.getEpisode(room, numChallengesPerEpisode, numPlayers, challenges);
			challenges = challenges.concat(episode.challenges);
			episodes.push(episode);
		}

		return episodes;
	}

	static getEpisode(room, numChallengesPerEpisode, numPlayersInEpisode, currentChallenges) {
		let challenges = [];
		for (let i = 0; i < numChallengesPerEpisode; i++) {
			let challenge = ChallengeService.getRandomChallengeForPlayers(room, numPlayersInEpisode, currentChallenges);
			challenges.push(challenge);
			currentChallenges = currentChallenges.concat(challenge);
		}
		return new Episode(numPlayersInEpisode, challenges);
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
