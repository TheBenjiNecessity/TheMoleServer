import WiseMonkeysChallengeData from './data';
import RoomSampleService from '../../services/sample/room.sample';
import WiseMonkeysChallenge from './model';
import Room from '../../models/room.model';
import { IRiddleService } from '../../services/game/riddle.service';
import riddleModel from '../../models/riddle.model';
import Riddle from '../../models/riddle.model';

const MAX_NUM_RIDDLES = 3;

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

function getWiseMonkeysChallenge(room: Room): WiseMonkeysChallenge {
	const buttonChallengeData = new WiseMonkeysChallengeData(new MockRiddleService());
	buttonChallengeData.initModel(room.playersStillPlaying, 'en');
	return buttonChallengeData.model as WiseMonkeysChallenge;
}

function getMockComponents() {
	let room = RoomSampleService.getTestRoomWithFourPlayers();
	let wiseMonkeysChallenge = getWiseMonkeysChallenge(room);

	return { wiseMonkeysChallenge };
}

let mockChallenge: WiseMonkeysChallenge = null;

beforeEach(() => {
	mockChallenge = getMockComponents().wiseMonkeysChallenge;
});

test('Checks initializing WiseMonkeysChallenge model', () => {
	expect(mockChallenge.currentRiddleIndex).toBe(0);
});

test('Checks currentRiddle/challengeIsOver getters', () => {
	let { currentRiddle } = mockChallenge;
	expect(currentRiddle.text).toBe('Dolphin');
	expect(currentRiddle.answer).toBe('Dolphin');
	expect(currentRiddle.type).toBe(Riddle.RIDDLE_TYPE.WORD);

	mockChallenge.goToNextRiddle();

	currentRiddle = mockChallenge.currentRiddle;
	expect(currentRiddle.text).toBe('Tiger');
	expect(currentRiddle.answer).toBe('Tiger');
	expect(currentRiddle.type).toBe(Riddle.RIDDLE_TYPE.WORD);

	mockChallenge.goToNextRiddle();

	currentRiddle = mockChallenge.currentRiddle;
	expect(currentRiddle.text).toBe('Cheetah');
	expect(currentRiddle.answer).toBe('Cheetah');
	expect(currentRiddle.type).toBe(Riddle.RIDDLE_TYPE.WORD);

	mockChallenge.goToNextRiddle();

	expect(mockChallenge.challengeIsOver).toBeTruthy();
});

test('Checks getRoles method', () => {
	const roles = mockChallenge.getRoles(0);

	expect(roles).toHaveLength(3);
	expect(roles[0].name).toBe('See no evil');
	expect(roles[0].numPlayers).toBe(2);
	expect(roles[1].name).toBe('Hear no evil');
	expect(roles[1].numPlayers).toBe(2);
	expect(roles[2].name).toBe('Speak no evil');
	expect(roles[2].numPlayers).toBe(2);
});

test('Checks isAnswerCorrect method', () => {
	expect(mockChallenge.isAnswerCorrect('Cheetah')).toBeFalsy();
	expect(mockChallenge.isAnswerCorrect('Tiger')).toBeFalsy();
	expect(mockChallenge.isAnswerCorrect('Dolphin')).toBeTruthy();

	mockChallenge.goToNextRiddle();

	expect(mockChallenge.isAnswerCorrect('Cheetah')).toBeFalsy();
	expect(mockChallenge.isAnswerCorrect('Tiger')).toBeTruthy();
	expect(mockChallenge.isAnswerCorrect('Dolphin')).toBeFalsy();

	mockChallenge.goToNextRiddle();

	expect(mockChallenge.isAnswerCorrect('Cheetah')).toBeTruthy();
	expect(mockChallenge.isAnswerCorrect('Tiger')).toBeFalsy();
	expect(mockChallenge.isAnswerCorrect('Dolphin')).toBeFalsy();

	mockChallenge.goToNextRiddle();
	expect(mockChallenge.challengeIsOver).toBeTruthy();
});
