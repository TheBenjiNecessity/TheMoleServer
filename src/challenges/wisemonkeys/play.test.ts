import RoomSampleService from '../../services/sample/room.sample';
import EpisodeSampleService from '../../services/sample/episode.sample';
import RoomController from '../../controllers/room.controller';
import { getMockRoomControllerWithRoom } from '../../services/sample/room-controller.sample';
import WiseMonkeysChallengeData from './data';
import Riddle from '../../models/riddle.model';
import { IRiddleService } from '../../services/game/riddle.service';
import WiseMonkeysChallengeController from './controller';
import Room from '../../models/room.model';

jest.useFakeTimers();

const riddleData = [
	{
		text: 'Dolphin',
		type: Riddle.RIDDLE_TYPE.WORD,
		answer: 'Dolphin'
	},
	{
		text: 'Tiger',
		type: Riddle.RIDDLE_TYPE.WORD,
		answer: 'Tiger'
	},
	{
		text: 'Cheetah',
		type: Riddle.RIDDLE_TYPE.WORD,
		answer: 'Cheetah'
	}
];

class MockRiddleService implements IRiddleService {
	getRandomRiddle(lang: string, type: string): Riddle {
		throw new Error('Method not implemented.');
	}

	getRiddleList(lang: string, type: string, count: number): Riddle[] {
		return riddleData.map((r) => new Riddle(r.text, r.answer, r.type));
	}
}

function getMockRoom() {
	const room = RoomSampleService.getTestRoomForNumPlayers(5);
	const wiseMonkeysChallengeData = new WiseMonkeysChallengeData(new MockRiddleService());
	wiseMonkeysChallengeData.initModel(room.playersStillPlaying, 'en');
	room.currentEpisode = EpisodeSampleService.getTestEpisodeWithChallengeData(room.playersStillPlaying, [
		wiseMonkeysChallengeData
	]);
	return room;
}

function getMockComponents() {
	let room = getMockRoom();
	let roomController = getMockRoomControllerWithRoom(room);
	let wiseMonkeysChallengeController = room.currentEpisode.getCurrentChallengeController(
		roomController
	) as WiseMonkeysChallengeController;

	return { room, roomController, wiseMonkeysChallengeController };
}

let room: Room = null;
let roomController: RoomController = null;
let wiseMonkeysChallengeController: WiseMonkeysChallengeController = null;

beforeEach(() => {
	let obj = getMockComponents();
	room = obj.room;
	roomController = obj.roomController;
	wiseMonkeysChallengeController = obj.wiseMonkeysChallengeController;
});

test('Plays through the challenge where the players get through all riddles', () => {
	const { roomcode } = room;
	let tick = 0;

	function doneCB() {
		throw new Error('The timer should not be able to complete');
	}

	function tickCB() {
		tick++;

		if (tick === 1) {
			let message = wiseMonkeysChallengeController.enterRiddleAnswer(roomcode, '');
			let wiseMonkeysChallenge = wiseMonkeysChallengeController.getCurrentChallenge(roomcode);

			expect(message).toBe('wisemonkeys-entered-riddle');
			expect(wiseMonkeysChallenge.currentRiddle.text).toBe('Dolphin');
			expect(wiseMonkeysChallenge.currentRiddle.answer).toBe('Dolphin');
			expect(wiseMonkeysChallenge.currentRiddle.type).toBe(Riddle.RIDDLE_TYPE.WORD);

			message = wiseMonkeysChallengeController.enterRiddleAnswer(roomcode, 'Dolphin');
			wiseMonkeysChallenge = wiseMonkeysChallengeController.getCurrentChallenge(roomcode);

			expect(message).toBe('wisemonkeys-move-next');
			expect(wiseMonkeysChallenge.currentRiddle.text).toBe('Tiger');
			expect(wiseMonkeysChallenge.currentRiddle.answer).toBe('Tiger');
			expect(wiseMonkeysChallenge.currentRiddle.type).toBe(Riddle.RIDDLE_TYPE.WORD);

			message = wiseMonkeysChallengeController.enterRiddleAnswer(roomcode, 'Tiger');
			wiseMonkeysChallenge = wiseMonkeysChallengeController.getCurrentChallenge(roomcode);

			expect(message).toBe('wisemonkeys-move-next');
			expect(wiseMonkeysChallenge.currentRiddle.text).toBe('Cheetah');
			expect(wiseMonkeysChallenge.currentRiddle.answer).toBe('Cheetah');
			expect(wiseMonkeysChallenge.currentRiddle.type).toBe(Riddle.RIDDLE_TYPE.WORD);

			message = wiseMonkeysChallengeController.enterRiddleAnswer(roomcode, 'Cheetah');
			room = roomController.getRoom(roomcode);

			expect(message).toBe('wisemonkeys-challenge-over');
			expect(room.points).toBe(10);
		}
	}

	roomController.startTimer(roomcode, 10, 1, tickCB, doneCB);

	jest.runAllTimers();
});

test("Plays through the challenge where the players don't get through all riddles", () => {});

// Run a challenge with a timer where nothing happens during the challenge
// roomController.startTimer(roomcode, 10, 1, () => {}, doneCB);

// jest.runAllTimers();
