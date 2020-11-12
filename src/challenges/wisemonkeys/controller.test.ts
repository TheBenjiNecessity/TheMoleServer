import RoomSampleService from '../../models/samples/room.sample';
import EpisodeSampleService from '../../models/samples/episode.sample';
import RoomController from '../../controllers/room.controller';
import { getMockRoomController } from '../../models/samples/room-controller.sample';
import PlatterChallengeController from './controller';
import PlatterChallengeData from './data';
import PlatterChallenge from './model';

const SAMPLE_RIDDLE_ANSWER = 'I am going to stop the mole';

function getMockPlatterChallengeController(roomController: RoomController) {
	return new PlatterChallengeController(roomController);
}

function getMockRoom() {
	let room = RoomSampleService.getTestRoomForNumPlayers(5);
	let platterChallenge = new PlatterChallengeData().getModel(room.playersStillPlaying, 'en') as PlatterChallenge;
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

test('Checks chooseExemption method', () => {});
