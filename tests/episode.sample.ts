import Challenge from '../src/models/challenge.model';
import questionData from '../src/models/quiz/question.data';
import Episode from '../src/models/episode.model';

export default class EpisodeSampleService {
	static getTestEpisode(room) {
		let currentChallenge = new Challenge(room.playersStillPlaying, 'Test', '', 10, 3, [], 'game', [], 'test');
		return new Episode(
			room.playersStillPlaying,
			[ currentChallenge ],
			questionData.map((q) => {
				return { text: q.text, type: q.type, choices: q.choices };
			})
		);
	}

	static getTestEpisodeWithChallenge(room, currentChallenge) {
		return new Episode(
			room.playersStillPlaying,
			[ currentChallenge ],
			questionData.map((q) => {
				return { text: q.text, type: q.type, choices: q.choices };
			})
		);
	}
}
