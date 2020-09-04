export const CHALLENGE_SOCKET_EVENTS = {
	RAISE_HAND: 'raise-hand',
	MOVE_NEXT: 'challenge-move-next',
	AGREE_TO_ROLES: 'agree-to-roles',
	VOTED_PLAYER: 'voted-player',
	REMOVE_VOTED_PLAYER: 'remove-voted-player'
};

export const CHALLENGE_EVENTS = {
	ADD_AGREED_PLAYER: 'addAgreedPlayer',
	RAISE_HAND_FOR_PLAYER: 'raiseHandForPlayer',
	SET_VOTED_PLAYER: 'setVotedPlayer',
	REMOVE_VOTED_PLAYER: 'removeVotedPlayer'
};

export const CHALLENGE_STATES = {
	CHALLENGE_EXPLANATION: 'challenge-explanation',
	ROLE_SELECTION: 'role-selection',
	IN_GAME: 'game'
};
