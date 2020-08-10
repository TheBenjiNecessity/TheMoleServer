import ChallengeService from './challenge.service';
import challengeData from '../../models/challenges/challenge.data';

test('Checks getNumPlayersRestrictedChallenges method', () => {
	let challenges6 = ChallengeService.getNumPlayersRestrictedChallenges(6);
	expect(Array.isArray(challenges6)).toBe(true);

	for (let challenge of challenges6) {
		expect(ChallengeService.canSupportNumPlayers(challenge, 6)).toBe(true);
	}

	let challenges5 = ChallengeService.getNumPlayersRestrictedChallenges(5);
	expect(Array.isArray(challenges5)).toBe(true);

	for (let challenge of challenges5) {
		expect(ChallengeService.canSupportNumPlayers(challenge, 5)).toBe(true);
	}

	let challenges1 = ChallengeService.getNumPlayersRestrictedChallenges(1);
	expect(Array.isArray(challenges1)).toBe(true);
	expect(challenges1.length).toBe(0);
});

test('Checks getRandomChallengeForPlayers method', () => {
	let challenge = ChallengeService.getRandomChallengeForPlayers(6, []);
	expect(typeof challenge).toBe('object');
	expect(ChallengeService.canSupportNumPlayers(challenge, 6)).toBe(true);
});

test('Checks canSupportNumPlayers method', () => {
	let pathChallenge = challengeData['path'];
	expect(ChallengeService.canSupportNumPlayers(pathChallenge, 2)).toBe(false);
	expect(ChallengeService.canSupportNumPlayers(pathChallenge, 3)).toBe(false);
	expect(ChallengeService.canSupportNumPlayers(pathChallenge, 4)).toBe(false);
	expect(ChallengeService.canSupportNumPlayers(pathChallenge, 5)).toBe(true);
});
