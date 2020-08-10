import { Episode } from '../../models/episode.model';
import ChallengeService from './challenge.service';

export default class EpisodeService {
	constructor() {}

	static generateEpisodes(room) {
		let episodes = [];
		let challenges = [];
		let numPlayers = room.players.length;
		for (let i = numPlayers; i >= 2; i--) {
			let episode = this.getEpisode(numPlayers, i, challenges);
			challenges = challenges.concat(episode.challenges);
			episodes.push(episode);
		}

		return episodes;
	}

	static getEpisode(numAllPlayers, numPlayers, currentChallenges) {
		let challenges = [];
		for (let i = 0; i < EpisodeService.getNumChallenges(numAllPlayers); i++) {
			let challenge = ChallengeService.getRandomChallengeForPlayers(numPlayers, currentChallenges);
			challenges.push(challenge);
			currentChallenges = currentChallenges.concat(challenge);
		}
		return new Episode(numPlayers, challenges);
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
