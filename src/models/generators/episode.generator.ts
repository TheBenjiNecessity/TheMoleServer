import * as _ from 'lodash';
import ChallengeData from '../../interfaces/challenge-data';
import ChallengeService from '../../services/game/challenge.service';
import Episode from '../episode.model';
import Player from '../player.model';
import Question from '../quiz/question.model';

export interface IEpisodeGenerator {
	generateCurrentEpisode(
		numChallenges: number,
		playersStillPlaying: Player[],
		unusedChallenges: ChallengeData[],
		unaskedQuestions: Question[],
		language: string
	): Episode;
}

export class EpisodeGenerator implements IEpisodeGenerator {
	constructor() {}

	generateCurrentEpisode(
		numChallenges: number,
		playersStillPlaying: Player[],
		unusedChallenges: ChallengeData[],
		unaskedQuestions: Question[],
		language: string
	): Episode {
		let challenges = [];
		for (let i = 0; i < numChallenges; i++) {
			let numRestrictedChallenges = ChallengeService.listChallengesForNumPlayers(
				playersStillPlaying.length,
				unusedChallenges,
				challenges
			);

			if (numRestrictedChallenges.length <= 0) {
				//TODO could cause episode to have fewer challenges than should
				continue;
			}

			const shuffledNumRestrictedChallenges = _.shuffle(numRestrictedChallenges);
			const randomChallenge = shuffledNumRestrictedChallenges[0];
			randomChallenge.initModel(playersStillPlaying, language);
			challenges.push(randomChallenge);
		}

		return new Episode(playersStillPlaying, challenges, unaskedQuestions);
	}
}
