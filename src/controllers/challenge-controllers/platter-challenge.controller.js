import ChallengeController from '../challenge.controller';

export class PlatterChallengeController extends ChallengeController {
    constructor(webSocketController) {
        super(webSocketController);
        

    }

 
}

/**
 * Challenge:
 *  - skip passed raise hand section
 *  - send message to room to show 
 */