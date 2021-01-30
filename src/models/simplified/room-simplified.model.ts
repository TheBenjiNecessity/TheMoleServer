import Player from '../player.model';
import Room from '../room.model';
import SimplifiedEpisode from './episode-simplified.model';
import SimplifiedPlayer from './player-simplified.model';

export default class SimplifiedRoom {
	state: string;
	roomcode: string;
	points: number;
	players: SimplifiedPlayer[];
	agreedPlayers: SimplifiedPlayer[];
	challengeStart: number;
	challengeCurrent: number;
	challengeEnd: number;
	simplifiedCurrentEpisode: SimplifiedEpisode;

	constructor(room: Room, players: Player[]) {
		this.state = room.state;
		this.players = players.map((p) => new SimplifiedPlayer(p));
		this.roomcode = room.roomcode;
		this.points = room.points;
		this.agreedPlayers = room.moveNextAgreedPlayers.map((p) => new SimplifiedPlayer(p));
		this.challengeStart = room.challengeStart;
		this.challengeCurrent = room.challengeCurrent;
		this.challengeEnd = room.challengeEnd;

		this.simplifiedCurrentEpisode = room.currentEpisode ? room.currentEpisode.simplifiedEpisode : null;
	}
}
