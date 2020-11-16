import RoomController from './room.controller';
import { CHALLENGE_EVENTS, CHALLENGE_SOCKET_EVENTS } from '../contants/challenge.constants';
import Challenge from '../models/challenge.model';

const MILLISECONDS_IN_SECOND = 1000;

export default class ChallengeController {
	constructor(protected roomController: RoomController) {}

	raiseHand(roomcode: string, playerName: string, roleName: string): string {
		let room = this.roomController.getRoom(roomcode);
		if (room.currentEpisode.currentChallenge.state !== Challenge.CHALLENGE_STATES.ROLE_SELECTION) {
			return null;
		}

		this.performEvent(roomcode, CHALLENGE_EVENTS.RAISE_HAND_FOR_PLAYER, playerName, roleName);

		return CHALLENGE_SOCKET_EVENTS.RAISE_HAND;
	}

	agreeToRoles(roomcode: string, playerName: string): string {
		let room = this.roomController.getRoom(roomcode);
		let { currentChallenge } = room.currentEpisode;
		if (
			currentChallenge.state !== Challenge.CHALLENGE_STATES.ROLE_SELECTION ||
			!currentChallenge.raisedHandsAreValid
		) {
			return;
		}

		this.performEvent(roomcode, CHALLENGE_EVENTS.ADD_AGREED_PLAYER, playerName);

		if (room.currentEpisode.currentChallenge.hasMajorityVoteForAgreedPlayers) {
			room.currentEpisode.currentChallenge.moveNext();
			this.roomController.setRoom(room);
			return CHALLENGE_SOCKET_EVENTS.MOVE_NEXT;
		} else {
			return CHALLENGE_SOCKET_EVENTS.AGREE_TO_ROLES;
		}
	}

	addPlayerVote(roomcode: string, playerName: string): string {
		this.performEvent(roomcode, CHALLENGE_EVENTS.SET_VOTED_PLAYER, playerName);
		return CHALLENGE_SOCKET_EVENTS.VOTED_PLAYER;
	}

	removePlayerVote(roomcode: string, playerName: string): string {
		this.performEvent(roomcode, CHALLENGE_EVENTS.REMOVE_VOTED_PLAYER, playerName);
		return CHALLENGE_SOCKET_EVENTS.REMOVE_VOTED_PLAYER;
	}

	startTimer(
		roomcode: string,
		milliseconds: number,
		interval: number = MILLISECONDS_IN_SECOND,
		tickCallback,
		doneCallBack
	) {
		const tickCB = () => {
			tickCallback();
			this.roomController.sendTimerTick(roomcode);
		};
		const doneCB = () => {
			doneCallBack();
			this.roomController.sendTimerDone(roomcode);
		};
		this.performEvent(roomcode, CHALLENGE_EVENTS.START_TIMER, roomcode, tickCB, doneCB, milliseconds, interval);
	}

	performEvent(roomcode: string, event: string, ...args) {
		return this.roomController.performEventOnChallenge(roomcode, event, ...args);
	}
}
