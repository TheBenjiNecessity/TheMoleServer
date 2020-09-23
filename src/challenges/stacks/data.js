import StacksChallengeController from './controller';
import StacksChallenge from './model';

export default {
	type: 'button',
	maxPlayers: 6,
	minPlayers: 6,
	initialState: 'game',
	lang: {
		en: {
			title: 'Stacks',
			description: '',
			questions: [
				{
					text: '',
					type: 'choices',
					choices: [ 'Yes', 'No' ]
				}
			]
		}
	},
	getController: function() {
		return StacksChallengeController.getInstance();
	},
	getModel: function(players, lang) {
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
};
