import ChallengeData from '../../interfaces/challenge-data';
import IController from '../../interfaces/controller.interface';
import ISocketHandler from '../../interfaces/socket-handler.interface';
import Challenge from '../../models/challenge.model';
import OutAndSafeChallengeController from './controller';
import OutAndSafeChallenge from './model';
import OutAndSafeChallengeSocketHandler from './socket-handler';

export default class OutAndSafeChallengeData extends ChallengeData {
	constructor() {
		super('out-and-safe', 10, 5, 'game', {
			en: {
				title: 'Out/Safe',
				description: '',
				questions: [
					{
						text: 'During the "Out and Safe" challenge, did the mole play an out card?',
						type: 'boolean',
						choices: [ 'Yes', 'No' ]
					}
				]
			}
		});
	}

	getController(): IController {
		return OutAndSafeChallengeController.getInstance();
	}
	getSocketHandler(): ISocketHandler {
		return OutAndSafeChallengeSocketHandler.getInstance();
	}
	getModel(players, lang): Challenge {
		return new OutAndSafeChallenge(
			players,
			this.lang[lang].title,
			this.lang[lang].description,
			this.maxPlayers,
			this.minPlayers,
			this.lang[lang].questions,
			this.initialState
		);
	}
}
