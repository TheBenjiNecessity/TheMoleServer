import Player from '../../models/player.model';
import Room, { IMoleChooser } from '../../models/room.model';
import ChallengeSampleService from '../../services/sample/challenge.sample';
import EpisodeSampleService from './episode.sample';

class MoleChooser implements IMoleChooser {
	constructor() {}

	getMoleIndex(players: Player[]) {
		return 0;
	}
}

export default class RoomSampleService {
	static getTestRoomWithTenPlayers() {
		return RoomSampleService.getTestRoomForNumPlayers(10);
	}

	static getTestRoomWithFivePlayers() {
		return RoomSampleService.getTestRoomForNumPlayers(5);
	}

	static getTestRoomWithFourPlayers() {
		return RoomSampleService.getTestRoomForNumPlayers(4);
	}

	static getTestRoomWithNoPlayers() {
		return new Room('TEST', 'en');
	}

	static getTestRoomForNumPlayers(numPlayers) {
		let room = new Room('TEST', 'en', new MoleChooser());

		for (let i = 1; i <= numPlayers; i++) {
			room.addPlayer(new Player(`test${i}`));
		}

		room.chooseMole();

		return room;
	}

	static getMockRoom(numPlayers, withRoles: boolean[] = [ false ]) {
		const room = RoomSampleService.getTestRoomForNumPlayers(numPlayers);
		const challengeData = ChallengeSampleService.getTestChallengeData(room.playersStillPlaying, withRoles);
		room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallengeData(
			room.playersStillPlaying,
			challengeData
		);
		return room;
	}

	static getMockRoomWithOneChallenge(numPlayers, withRoles = false) {
		return RoomSampleService.getMockRoom(numPlayers, [ withRoles ]);
	}
}
