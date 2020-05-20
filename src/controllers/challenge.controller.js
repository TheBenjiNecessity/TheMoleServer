class ChallengeController {
    constructor(webSocketController) {
        this.webSocketController = webSocketController;
        webSocketController.addEvent('raise-hand', this.raiseHand);
        webSocketController.addEvent('agree-to-roles', this.agreeRoles);
    }

    raiseHand(room) {

    }

    agreeRoles(room) {

    }
}

export class ChallengeControllerCreator {
    constructor() {}

    static createController(webSocketController) {
        if (!ChallengeControllerCreator.instance) {
            ChallengeControllerCreator.instance = new ChallengeController(webSocketController);
        }

        return ChallengeControllerCreator.instance;
    }
}