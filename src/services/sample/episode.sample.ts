import Episode from '../../models/episode.model';
import ChallengeData from '../../interfaces/challenge-data';
import QuizSampleService from './quiz.sample';
import Player from '../../models/player.model';
import ChallengeSampleService from './challenge.sample';

export default class EpisodeSampleService {
	static getTestEpisode(players: Player[]) {
		const challengeData = ChallengeSampleService.getTestChallengeDatum(players);
		return EpisodeSampleService.getTestEpisodeWithChallengeData(players, [ challengeData ]);
	}

	static getTestEpisodeWithChallengeData(players: Player[], currentChallengeData: ChallengeData[]) {
		return new Episode(players, currentChallengeData, QuizSampleService.getQuestionList(100));
	}
}
