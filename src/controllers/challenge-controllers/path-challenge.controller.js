import RoomHandlerCreator from '../room.controller';
import WebSocketServiceCreator from '../../services/websocket.service';

class PathChallengeController {
	constructor() {}

	chooseChest({ room, player, choice }) {
		this.updateRoom(room.roomcode, choice, 'chest', 'path-choose-chest');
	}

	addVoteForChest({ room, player, choice }) {
		this.updateRoom(room.roomcode, choice, 'vote', 'path-vote-chest');
	}

	removeVoteForChest({ room, player, choice }) {
		this.updateRoom(room.roomcode, choice, 'remove', 'path-remove-vote-chest');
	}

	updateRoom(roomcode, choice, action, socketFunctionName) {
		let { roomcode } = rooms;
		let newRoom = RoomHandlerCreator.getInstance().rooms[roomcode];
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
		RoomHandlerCreator.getInstance().rooms[roomcode] = newRoom;
		WebSocketServiceCreator.getInstance().sendToRoom(roomcode, socketFunctionName, newRoom);
	}

	setupSocket(socket) {
		socket.on('path-choose-chest', this.chooseChest);
		socket.on('path-add-vote-chest', this.addVoteForChest);
		socket.on('path-remove-vote-chest', this.removeVoteForChest);
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
