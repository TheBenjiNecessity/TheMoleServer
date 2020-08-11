import ChallengeService from './challenge.service';
import challengeData from '../../models/challenges/challenge.data';
import RoomService from '../room/roomcode.service';

test('Checks getNumPlayersRestrictedChallengeData method', () => {
	let challenges6 = ChallengeService.getNumPlayersRestrictedChallengeData(6);
	expect(Array.isArray(challenges6)).toBe(true);

	for (let challenge of challenges6) {
		expect(ChallengeService.canSupportNumPlayers(challenge, 6)).toBe(true);
	}

	let challenges5 = ChallengeService.getNumPlayersRestrictedChallengeData(5);
	expect(Array.isArray(challenges5)).toBe(true);

	for (let challenge of challenges5) {
		expect(ChallengeService.canSupportNumPlayers(challenge, 5)).toBe(true);
	}

	let challenges1 = ChallengeService.getNumPlayersRestrictedChallengeData(1);
	expect(Array.isArray(challenges1)).toBe(true);
	expect(challenges1.length).toBe(0);
});

// test('Checks getRandomChallengeForPlayers method', () => {
// 	let room = RoomService.getTestRoomWithTenPlayers();
// 	let challenge = ChallengeService.getRandomChallengeForPlayers(room, 6, []);
// 	expect(typeof challenge).toBe('object');
// 	expect(challenge.canSupportNumPlayers(6)).toBe(true);
// });

test('Checks canSupportNumPlayers method', () => {
	let pathChallengeData = challengeData.find((c) => c.type === 'path');
	expect(ChallengeService.canSupportNumPlayers(pathChallengeData, 2)).toBe(false);
	expect(ChallengeService.canSupportNumPlayers(pathChallengeData, 3)).toBe(false);
	expect(ChallengeService.canSupportNumPlayers(pathChallengeData, 4)).toBe(false);
	expect(ChallengeService.canSupportNumPlayers(pathChallengeData, 5)).toBe(true);
});
