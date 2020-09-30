import ChallengeData from '../../interfaces/challenge-data';
import IController from '../../interfaces/controller.interface';
import ISocketHandler from '../../interfaces/socket-handler.interface';
import Challenge from '../../models/challenge.model';
import StacksChallengeController from './controller';
import StacksChallenge from './model';
import StacksChallengeSocketHandler from './socket-handler';

class PlatterChallengeData extends ChallengeData {
	constructor() {
		super('stacks', 6, 6, 'game', {
			en: {
				title: 'Stacks',
				description: '',
				questions: [
					{
						text: "What was the amount of points on the mole's stack?",
						type: 'choices',
						choices: [ '-5', '-3', '-1', '1', '3', '5' ]
					}
				]
			}
		});
	}

	getController(): IController {
		return StacksChallengeController.getInstance();
	}
	getSocketHandler(): ISocketHandler {
		return StacksChallengeSocketHandler.getInstance();
	}
	getModel(players, lang): Challenge {
		return new StacksChallenge(
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

export default { data: new PlatterChallengeData() };
