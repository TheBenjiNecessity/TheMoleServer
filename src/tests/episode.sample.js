import Episode from '../models/episode.model';
import Question from '../models/quiz/question.model';
import questionData from '../models/quiz/question.data';
import Challenge from '../models/challenge.model';

export default class EpisodeSampleService {
	static getTestEpisode(room) {
		let currentChallenge = new Challenge(room.playersStillPlaying, 'Test', '', 10, 3, [], 'game', [], 'test');
		return new Episode(
			room.playersStillPlaying,
			[ currentChallenge ],
			questionData.map((q) => new Question(q.text, q.type, q.choices))
		);
	}

	static getTestEpisodeWithChallenge(room, currentChallenge) {
		return new Episode(
			room.playersStillPlaying,
			[ currentChallenge ],
			questionData.map((q) => new Question(q.text, q.type, q.choices))
		);
	}
}
