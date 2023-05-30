import ChallengeData from '../../interfaces/challenge-data';
import Room from '../../models/room.model';
import ChallengeSampleService from './challenge.sample';
import QuizSampleService from './quiz.sample';
import Episode from '../../models/episode.model';
import Player from '../../models/player.model';
import ChallengeService from '../game/challenge.service';
import Question from '../../models/quiz/question.model';
import { getMockRoomControllerWithRoom } from './room-controller.sample';
import { IMoleChooser } from '../../models/generators/moleChooser.generator';
import { IEpisodeGenerator } from '../../models/generators/episode.generator';

class MoleChooser implements IMoleChooser {
	constructor() {}

	getMoleIndex(players: Player[]) {
		return 0;
	}
}

class EpisodeGenerator implements IEpisodeGenerator {
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
				continue;
			}

			const tempChallengeData = numRestrictedChallenges[0];
			tempChallengeData.initModel(playersStillPlaying, 'en');
			challenges.push(tempChallengeData);
		}

		return new Episode(playersStillPlaying, challenges, QuizSampleService.getQuestionList(10));
	}
}

export function getMockComponents(numPlayers: number, withRoles: boolean[] = [ false ]) {
	const room = new Room('TEST', 'en', new MoleChooser(), new EpisodeGenerator());
	const { roomcode } = room;

	for (let i = 0; i < numPlayers; i++) {
		const name = 'test' + (i + 1);
		room.addPlayer(new Player(name));
	}

	const challengeData = ChallengeSampleService.getTestChallengeData(room.playersStillPlaying, withRoles);
	const roomController = getMockRoomControllerWithRoom(room, challengeData);

	return { roomcode, roomController };
}

export function getMockComponentsWithOneChallenge(numPlayers: number, withRoles: boolean = false) {
	return getMockComponents(numPlayers, [ withRoles ]);
}

export function getMockComponentsWithOneRoleChallenge(numPlayers: number) {
	return getMockComponentsWithOneChallenge(numPlayers, true);
}
