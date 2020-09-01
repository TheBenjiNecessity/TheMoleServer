import Episode from '../models/episode.model';
import PathChallenge from '../models/challenges/path.challenge';
import Question from '../models/quiz/question.model';
import questionData from '../models/quiz/question.data';

export default class EpisodeSampleService {
	static getTestEpisode(room) {
		return new Episode(
			room.playersStillPlaying,
			[ new PathChallenge(room.playersStillPlaying) ],
			questionData.map((q) => new Question(q.text, q.type, q.choices))
		);
	}
}
