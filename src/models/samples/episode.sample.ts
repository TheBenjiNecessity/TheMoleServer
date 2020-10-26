import PathChallenge from '../../challenges/path/model';
import questionData from '../quiz/question.data';
import Episode from '../episode.model';
import ButtonChallenge from '../../challenges/button/model';

export default class EpisodeSampleService {
	static getTestEpisode(room) {
		let currentChallenge = new ButtonChallenge(room.playersStillPlaying, 'Test', '', []);
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
