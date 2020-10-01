import RoomController from './room.controller';
import { CHALLENGE_EVENTS } from '../contants/challenge.constants';
import Controller from '../interfaces/controller';

const MILLISECONDS_IN_SECOND = 1000;

export default class ChallengeController extends Controller {
	constructor(protected roomController: RoomController) {
		super(roomController);
	}

	startTimer(
		roomcode,
		milliseconds,
		interval = MILLISECONDS_IN_SECOND,
		timerTickCallback = (roomcode: string) => {},
		timerDoneCallback = (roomcode: string) => {}
	) {
		this.roomController.performEventOnChallenge(
			roomcode,
			CHALLENGE_EVENTS.START_TIMER,
			roomcode,
			timerTickCallback,
			timerDoneCallback,
			milliseconds,
			interval
		);
	}
}
