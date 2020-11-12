import RoomSampleService from '../../models/samples/room.sample';
import EpisodeSampleService from '../../models/samples/episode.sample';
import RoomController from '../../controllers/room.controller';
import { getMockRoomController } from '../../models/samples/room-controller.sample';
import PlatterChallengeController from './controller';
import WiseMonkeysChallenge from './model';
import WiseMonkeysChallengeData from './data';

function getMockPlatterChallengeController(roomController: RoomController) {
	return new PlatterChallengeController(roomController);
}

function getMockRoom() {
	let room = RoomSampleService.getTestRoomForNumPlayers(5);
	let platterChallenge = new WiseMonkeysChallengeData().getModel(
		room.playersStillPlaying,
		'en'
	) as WiseMonkeysChallenge;
	room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallenge(room, platterChallenge);
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
