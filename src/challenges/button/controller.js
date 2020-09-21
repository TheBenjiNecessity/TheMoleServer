import RoomControllerCreator from '../room.controller';
import WebSocketServiceCreator from '../../services/websocket.service';
import SchedulerServiceCreator from '../../services/scheduler.service';
import ChallengeController from '../../controllers/challenge.controller';

class ButtonChallengeControllerInstance {
	constructor() {}

	releasedButton({ roomcode, playerName }) {
		let event = 'setPlayerReleasedButton';
		let wsEvent = 'button-player-released';
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, { playerName });

		// If all buttons are released then the game is over
		if (buttonChallenge.allButtonsReleased) {
			room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, 'endChallenge');
			wsEvent = 'challenge-end';
		}

		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, wsEvent, room);
	}

	touchedButton({ roomcode, playerName }) {
		let event = 'setPlayerPressedButton';
		let wsEvent = 'button-player-pressed';
		let room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, event, { playerName });
		let buttonChallenge = room.currentEpisode.currentChallenge;

		// If it is the start of the game and everyone touches their button then the game begins
		if (buttonChallenge.allButtonsPressed && !buttonChallenge.isChallengeRunning) {
			room = ChallengeController.getInstance().startTimer(roomcode, 10);
			wsEvent = 'challenge-start';
		}

		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, wsEvent, room);
	}

	receivedPuzzleAnswer({ roomcode, playerName, answer }) {
		let room = RoomControllerCreator.getInstance().getRoom(roomcode);
		let buttonChallenge = room.currentEpisode.currentChallenge;
		if (buttonChallenge.isPlayerAnswerCorrect(answer)) {
			RoomControllerCreator.getInstance().giveObjectsToPlayer(roomcode, playerName, 'exemption', 1);
			room = RoomControllerCreator.getInstance().performEventOnChallenge(roomcode, 'endChallenge', {});
		}

		return WebSocketServiceCreator.getInstance().sendToRoom(roomcode, 'button-player-pressed', room);
	}

	setupSocket(socket) {
		socket.on('button-released-button', this.releasedButton);
		socket.on('button-touched-button', this.touchedButton);
		socket.on('button-received-answer', this.receivedPuzzleAnswer);
	}
}

export default class ButtonChallengeController {
	constructor() {}

	static getInstance() {
		if (!ButtonChallengeController.instance) {
			ButtonChallengeController.instance = new ButtonChallengeControllerInstance();
		}

		return ButtonChallengeController.instance;
	}
}
