import EpisodeService from './episode.service';
import RoomControllerCreator from '../../controllers/room.controller';
import RoomService from '../room/roomcode.service';

test('Checks getNumChallenges', () => {
	expect(EpisodeService.getNumChallenges(10)).toBe(3);
	expect(EpisodeService.getNumChallenges(9)).toBe(3);
	expect(EpisodeService.getNumChallenges(8)).toBe(3);
	expect(EpisodeService.getNumChallenges(7)).toBe(3);
	expect(EpisodeService.getNumChallenges(6)).toBe(4);
	expect(EpisodeService.getNumChallenges(5)).toBe(4);
	expect(EpisodeService.getNumChallenges(4)).toBe(4);
	expect(EpisodeService.getNumChallenges(3)).toBe(0);
	expect(EpisodeService.getNumChallenges(2)).toBe(0);
	expect(EpisodeService.getNumChallenges(1)).toBe(0);
	expect(EpisodeService.getNumChallenges(0)).toBe(0);
	expect(EpisodeService.getNumChallenges(11)).toBe(0);
});

test('Checks getEpisode method', () => {
	let numAllPlayers = 10;
	let numPlayers = 10;
	let currentChallenges = [];
	let room = RoomService.getTestRoomWithTenPlayers();
	let episode = EpisodeService.getEpisode(room, numAllPlayers, numPlayers, currentChallenges);
});

test('Checks generateEpisodes method', () => {
	let room = RoomService.getTestRoomWithTenPlayers();
	RoomControllerCreator.getInstance().setRoom(room);
	let episodes = EpisodeService.generateEpisodes(room);
});

/**
 * static generateEpisodes(room) {
		let episodes = [];
		let challenges = [];
		for (let i = numPlayers; i >= 2; i--) {
			let episode = this.getEpisode(numPlayers, i, challenges);
			challenges = challenges.concat(episode.challenges);
			episodes.push(episode);
		}

		return episodes;
	}

	static getEpisode(numAllPlayers, numPlayers, currentChallenges) {
		if (numPlayers === 2) {
			return new Episode(
				numPlayers,
				ChallengeService.getRandomChallengeForPlayers(numPlayers, currentChallenges)
			);
		} else {
			let challenges = [];
			let numChallengesPerEpisode = EpisodeService.getNumChallenges(numAllPlayers);
			for (let i = 0; i < numChallengesPerEpisode; i++) {
				challenges.push(ChallengeService.getRandomChallengeForPlayers(numPlayers, currentChallenges));
			}
			return new Episode(numPlayers, challenges);
		}
	}
 */
