class ChallengeController {
	constructor(webSocketController) {
		this.webSocketController = webSocketController;
		this.challengeClasses = {
			platter: new PlatterChallengeController(webSocketController)
		};
	}

	event(obj) {
		this.challengeClasses[obj.type][obj.event](obj.data);
	}
}

class PlatterChallengeController {
	constructor(webSocketController) {
		this.webSocketController = webSocketController;
	}
}

export class ChallengeControllerCreator {
	constructor() {}

	getInstance() {
		return RequestServiceCreator.instance;
	}

	static createController(webSocketController) {
		if (!ChallengeControllerCreator.instance) {
			ChallengeControllerCreator.instance = new ChallengeController(webSocketController);
		}

		return ChallengeControllerCreator.instance;
	}
}

/**
 * What does this controller do?:
 *  - handles challenge based events
 * Events:
 *  - from client
 *      - raiseHand: a player has raised their hand to be a certain role on the roles screen
 *      - agreeToRoles: a player has agreed to the current roles on the role select screen
 *  - to client
 *      - start challenge:
 *      - other events are specific to the subclass
 * Standard Challenge:
 * - Raise hand screen
 *      - components:
 *          - "Title text"
 *          - "instruction text" describing how certain roles for players is needed
 *          - multiple "raise hand" buttons with lists of "player names" under each
 *          - "agree" button at bottom with list of "player checkmarks" beside it
 *      - events:
 *          - "raise hand" button click
 *              - clicking on this button will add the player to a list under that button
 *              - all of the players in the "agree list" are removed
 *              - if the player belonged to another list, they will be removed from that list
 *          - "agree" button click
 *              - clicking on this button will add a checkmark next to the "agree" button
 *                signifying that they agree to the roles
 *          - once the majority of players click on the agree button then move onto the next screen
 *      - explanation
 *          - the idea of this screen is to pick roles that each player will have during the challenge
 *          - players must agree as a majority to the assigned roles in order to proceed
 *          - once a majority is reached, play moves to the next screen
 *          - it is possible for a challenge to not need to assign roles. If that is the case then this
 *            screen is skipped and players are moved right into the challenge
 * - Challenge Screen
 *      - components
 *          - Title text
 *          - Instructions
 *          - 
 */
