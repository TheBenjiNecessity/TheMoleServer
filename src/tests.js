import { RequestServiceCreator } from './services/request.service';
import { WebSocketControllerCreator } from './services/websocket.service';
import RoomControllerCreator from './controllers/room.controller';
import { ChallengeControllerCreator } from './controllers/challenge.controller';

import EpisodeService from './services/game/episode.service';
import LoggerService from './services/logger.service';

let episodeService = new EpisodeService();

LoggerService.log('this is a test');

LoggerService.logWithObj(episodeService.getEpisodes(10));

//console.log(episodeService.getEpisodes(10));
