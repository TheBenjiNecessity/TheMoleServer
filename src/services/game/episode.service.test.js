import EpisodeService from './episode.service';

test('Checks getNumChallenges', () => {
	const MAX = 100;
	const MIN = -100;
	for (let i = MIN; i <= MAX; i++) {
		let numChallenges = EpisodeService.getNumChallenges(i);
		if (i <= 10 && i >= 7) {
			expect(numChallenges).toBe(3);
		} else if (i <= 6 && i >= 4) {
			expect(numChallenges).toBe(4);
		} else {
			expect(numChallenges).toBe(0);
		}
	}
});
