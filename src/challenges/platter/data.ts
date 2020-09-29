import ChallengeData from '../../interfaces/challenge-data';
import IController from '../../interfaces/controller.interface';
import ISocketHandler from '../../interfaces/socket-handler.interface';
import Challenge from '../../models/challenge.model';
import PlatterChallengeController from './controller';
import PlatterChallenge from './model';
import PlatterChallengeSocketHandler from './socket-handler';

export default class PlatterChallengeData extends ChallengeData {
	constructor() {
		super('platter', 6, 4, 'game', {
			en: {
				title: 'The Platter',
				description: '',
				questions: [
					{
						text: 'In the "Platter" challenge, did the mole take the exemption?',
						type: 'boolean',
						choices: [ 'Yes', 'No' ]
					},
					{
						text: 'In the "Platter" challenge, in what position did the mole take points?',
						type: 'rank',
						choices: [ 'The mole did not take points' ]
					}
				]
			}
		});
	}

	getController(): IController {
		return PlatterChallengeController.getInstance();
	}
	getSocketHandler(): ISocketHandler {
		return PlatterChallengeSocketHandler.getInstance();
	}
	getModel(players, lang): Challenge {
		return new PlatterChallenge(
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
