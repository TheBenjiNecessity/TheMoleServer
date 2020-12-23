import RoomSampleService from '../../services/sample/room.sample';
import EpisodeSampleService from '../../services/sample/episode.sample';
import RoomController from '../../controllers/room.controller';
import { getMockRoomController } from '../../services/sample/room-controller.sample';
import WiseMonkeysChallengeData from './data';

const SAMPLE_RIDDLE_ANSWER = 'I am going to stop the mole';

function getMockRoom() {
	const room = RoomSampleService.getTestRoomForNumPlayers(5);
	const wiseMonkeysChallengeData = new WiseMonkeysChallengeData();
	wiseMonkeysChallengeData.initModel(room.playersStillPlaying, 'en');
	room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallengeData(room.playersStillPlaying, [
		wiseMonkeysChallengeData
	]);
	return room;
}

function getMockComponents() {
	let room = getMockRoom();
	let roomController = getMockRoomController();

	roomController.setRoom(room);

	return { room };
}

test('Checks chooseExemption method', () => {});
