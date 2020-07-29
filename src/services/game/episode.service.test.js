import EpisodeService from './episode.service';

test('Checks getNumChallenges', () => {
	expect(EpisodeService.getNumChallenges(10)).toBe(3);
	expect(EpisodeService.getNumChallenges(9)).toBe(3);
	expect(EpisodeService.getNumChallenges(8)).toBe(3);
	expect(EpisodeService.getNumChallenges(7)).toBe(3);
	expect(EpisodeService.getNumChallenges(6)).toBe(4);
	expect(EpisodeService.getNumChallenges(5)).toBe(4);
	expect(EpisodeService.getNumChallenges(4)).toBe(4);
	expect(EpisodeService.getNumChallenges(3)).toBe(0);
	expect(EpisodeService.getNumChallenges(11)).toBe(0);
});
