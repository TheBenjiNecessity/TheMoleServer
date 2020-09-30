import ChallengeData from '../../interfaces/challenge-data';
import IController from '../../interfaces/controller.interface';
import ISocketHandler from '../../interfaces/socket-handler.interface';
import Challenge from '../../models/challenge.model';
import ButtonChallengeController from './controller';
import ButtonChallenge from './model';
import ButtonChallengeSocketHandler from './socket-handler';

class ButtonChallengeData extends ChallengeData {
	constructor() {
		super('button', 4, 4, 'game', {
			en: {
				title: 'The Button',
				description: '',
				questions: [
					{
						text: 'Did the mole take the jokers?',
						type: 'choices',
						choices: [ 'Yes', 'No' ]
					}
				]
			}
		});
	}

	getController(): IController {
		return ButtonChallengeController.getInstance();
	}
	getSocketHandler(): ISocketHandler {
		return ButtonChallengeSocketHandler.getInstance();
	}
	getModel(players, lang): Challenge {
		return new ButtonChallenge(
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

export default { data: new ButtonChallengeData() };
