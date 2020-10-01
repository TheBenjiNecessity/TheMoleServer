import RoomController from '../controllers/room.controller';
import ChallengeController from '../controllers/challenge.controller';

export default class Controller {
	constructor(protected roomController: RoomController, protected challengeController: ChallengeController) {}
}
