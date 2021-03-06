import RoomSampleService from '../../services/sample/room.sample';
import EpisodeSampleService from '../../services/sample/episode.sample';
import RoomController from '../../controllers/room.controller';
import { getMockRoomController } from '../../services/sample/room-controller.sample';
import PlatterChallengeController from './controller';
import PlatterChallengeData from './data';
import PlatterChallenge from './model';

function getMockPlatterChallengeController(roomController: RoomController) {
	return new PlatterChallengeController(roomController);
}

function getMockRoom() {
	const room = RoomSampleService.getTestRoomForNumPlayers(5);
	const platterChallengeData = new PlatterChallengeData();
	platterChallengeData.initModel(room.playersStillPlaying, 'en');
	room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallengeData(room.playersStillPlaying, [
		platterChallengeData
	]);
	return room;
}

function getMockComponents() {
	let room = getMockRoom();
	let roomController = getMockRoomController();
	let platterChallengeController = getMockPlatterChallengeController(roomController);

	roomController.setRoom(room);

	return { room, roomController, platterChallengeController };
}

test('Plays through the challenge where the exemption is taken by the first player', () => {
	let { room, roomController, platterChallengeController } = getMockComponents();

	let message = platterChallengeController.chooseExemption(room.roomcode, room.playersStillPlaying[0].name);

	room = roomController.getRoom(room.roomcode);
	let platterChallenge = room.currentEpisode.currentChallenge as PlatterChallenge;

	expect(platterChallenge.playerWhoTookExemption).toEqual(room.playersStillPlaying[0]);
	expect(room.playersStillPlaying[0].numExemptions).toEqual(1);
	expect(room.playersStillPlaying[1].numExemptions).toEqual(0);
	expect(room.playersStillPlaying[2].numExemptions).toEqual(0);
	expect(room.playersStillPlaying[3].numExemptions).toEqual(0);
	expect(room.playersStillPlaying[4].numExemptions).toEqual(0);
	expect(platterChallenge.state).toBe('end');
	expect(message).toBe('took-exemption');
	expect(room.points).toBe(0);
});

test('Plays through the challenge where the exemption is taken by the third player', () => {
	let { room, roomController, platterChallengeController } = getMockComponents();

	let message = platterChallengeController.chooseMoney(room.roomcode, room.playersStillPlaying[0].name);
	expect(message).toBe('took-money');
	expect(roomController.getRoom(room.roomcode).points).toBe(3);

	message = platterChallengeController.chooseMoney(room.roomcode, room.playersStillPlaying[1].name);
	expect(message).toBe('took-money');
	expect(roomController.getRoom(room.roomcode).points).toBe(6);

	message = platterChallengeController.chooseExemption(room.roomcode, room.playersStillPlaying[2].name);
	let platterChallenge = room.currentEpisode.currentChallenge as PlatterChallenge;
	expect(message).toBe('took-exemption');
	expect(roomController.getRoom(room.roomcode).points).toBe(6);
	expect(platterChallenge.state).toBe('end');
});

test('Plays through the challenge where the exemption is taken by the last player', () => {
	let { room, roomController, platterChallengeController } = getMockComponents();

	let message = platterChallengeController.chooseMoney(room.roomcode, room.playersStillPlaying[0].name);
	expect(message).toBe('took-money');
	expect(roomController.getRoom(room.roomcode).points).toBe(3);

	message = platterChallengeController.chooseMoney(room.roomcode, room.playersStillPlaying[1].name);
	expect(message).toBe('took-money');
	expect(roomController.getRoom(room.roomcode).points).toBe(6);

	message = platterChallengeController.chooseMoney(room.roomcode, room.playersStillPlaying[2].name);
	expect(message).toBe('took-money');
	expect(roomController.getRoom(room.roomcode).points).toBe(9);

	message = platterChallengeController.chooseMoney(room.roomcode, room.playersStillPlaying[3].name);
	expect(message).toBe('took-money');
	expect(roomController.getRoom(room.roomcode).points).toBe(12);

	message = platterChallengeController.chooseExemption(room.roomcode, room.playersStillPlaying[4].name);
	let platterChallenge = room.currentEpisode.currentChallenge as PlatterChallenge;
	expect(message).toBe('took-exemption');
	expect(roomController.getRoom(room.roomcode).points).toBe(12);
	expect(platterChallenge.state).toBe('end');
});

test('Plays through the challenge where all players take money', () => {
	let { room, roomController, platterChallengeController } = getMockComponents();

	let message = platterChallengeController.chooseMoney(room.roomcode, room.playersStillPlaying[0].name);
	expect(message).toBe('took-money');
	expect(roomController.getRoom(room.roomcode).points).toBe(3);

	message = platterChallengeController.chooseMoney(room.roomcode, room.playersStillPlaying[1].name);
	expect(message).toBe('took-money');
	expect(roomController.getRoom(room.roomcode).points).toBe(6);

	message = platterChallengeController.chooseMoney(room.roomcode, room.playersStillPlaying[2].name);
	expect(message).toBe('took-money');
	expect(roomController.getRoom(room.roomcode).points).toBe(9);

	message = platterChallengeController.chooseMoney(room.roomcode, room.playersStillPlaying[3].name);
	expect(message).toBe('took-money');
	expect(roomController.getRoom(room.roomcode).points).toBe(12);

	message = platterChallengeController.chooseMoney(room.roomcode, room.playersStillPlaying[4].name);
	let platterChallenge = room.currentEpisode.currentChallenge as PlatterChallenge;
	expect(message).toBe('took-money');
	expect(roomController.getRoom(room.roomcode).points).toBe(15);
	expect(platterChallenge.state).toBe('end');
});
