import RoomSampleService from '../../services/sample/room.sample';
import EpisodeSampleService from '../../services/sample/episode.sample';
import RoomController from '../../controllers/room.controller';
import { getMockRoomController } from '../../services/sample/room-controller.sample';
import PlatterChallengeController from './controller';
import WiseMonkeysChallenge from './model';
import WiseMonkeysChallengeData from './data';

function getMockPlatterChallengeController(roomController: RoomController) {
	return new PlatterChallengeController(roomController);
}

function getMockRoom() {
	const room = RoomSampleService.getTestRoomForNumPlayers(5);
	const wiseMonkeysChallengeData = new WiseMonkeysChallengeData();
	wiseMonkeysChallengeData.initModel(room.playersStillPlaying, 'en');
	room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallenge(room, wiseMonkeysChallengeData);
	return room;
}

function getMockComponents() {
	let room = getMockRoom();
	let roomController = getMockRoomController();
	let platterChallengeController = getMockPlatterChallengeController(roomController);

	roomController.setRoom(room);

	return { room, roomController, platterChallengeController };
}

test('Plays through the challenge where the exemption is taken by the first player', () => {});
