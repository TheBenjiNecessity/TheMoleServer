import questionData from '../../models/quiz/question.data';
import Episode from '../../models/episode.model';
import ButtonChallengeData from '../../challenges/button/data';
import ChallengeData from '../../interfaces/challenge-data';
import Room from '../../models/room.model';

export default class EpisodeSampleService {
	static getTestEpisode(room: Room) {
		const buttonChallengeData = new ButtonChallengeData();
		buttonChallengeData.initModel(room.playersStillPlaying, 'en');
		return new Episode(
			room.playersStillPlaying,
			[ buttonChallengeData ],
			questionData['en'].map((q) => {
				return { text: q.text, type: q.type, choices: q.choices };
			})
		);
	}

	static getTestEpisodeWithChallenge(room: Room, currentChallengeData: ChallengeData) {
		return new Episode(
			room.playersStillPlaying,
			[ currentChallengeData ],
			questionData['en'].map((q) => {
				return { text: q.text, type: q.type, choices: q.choices };
			})
		);
	}
}
