import RoomHandlerCreator from '../room.controller';
import WebSocketServiceCreator from '../../services/websocket.service';

class PathChallengeController {
	constructor() {}

	chooseChest({ roomcode, choice }) {
		this.applyAction(roomcode, choice, 'chest', 'path-choose-chest');
	}

	addVoteForChest({ roomcode, choice }) {
		this.applyAction(roomcode, choice, 'vote', 'path-vote-chest');
	}

	removeVoteForChest({ roomcode, choice }) {
		this.applyAction(roomcode, choice, 'remove', 'path-remove-vote-chest');
	}

	applyAction(roomcode, choice, action, socketFunctionName) {
		let room = RoomHandlerCreator.getInstance().getRoom(roomcode);
		let newRoom = this.updateRoom(room, choice, action);
		RoomHandlerCreator.getInstance().setRoom(newRoom);
		WebSocketServiceCreator.getInstance().sendToRoom(newRoom.roomcode, socketFunctionName, newRoom);
	}

	updateRoom(room, choice, action) {
		let newRoom = room;
		let pathChallenge = newRoom.currentChallenge;

		if (choice === 'left') {
			if (action === 'chest') {
				pathChallenge.chooseLeft();
			} else if (action === 'vote') {
				pathChallenge.addLeftVote();
			} else {
				pathChallenge.removeLeftVote();
			}
		} else {
			if (action === 'chest') {
				pathChallenge.chooseRight();
			} else if (action === 'vote') {
				pathChallenge.addRightVote();
			} else {
				pathChallenge.removeRightVote();
			}
		}

		newRoom.currentChallenge = pathChallenge;
		return newRoom;
	}

	setupSocket(socket) {
		socket.on('path-choose-chest', this.chooseChest);
		socket.on('path-add-vote-chest', this.addVoteForChest);
	}
}

export default class PathChallengeControllerCreator {
	constructor() {}

	static getInstance() {
		if (!PathChallengeControllerCreator.instance) {
			PathChallengeControllerCreator.instance = new PathChallengeController();
		}

		return PathChallengeControllerCreator.instance;
	}
}
