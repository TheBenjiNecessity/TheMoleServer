import PathChallenge from '../../challenges/path/model';
import questionData from '../quiz/question.data';
import Episode from '../episode.model';

export default class EpisodeSampleService {
	static getTestEpisode(room) {
		let currentChallenge = new PathChallenge(room.playersStillPlaying, 'Test', '', 10, 3, [], 'game');
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
