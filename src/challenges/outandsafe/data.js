import OutAndSafeChallengeController from './controller';
import OutAndSafeChallenge from './model';

export default {
	type: 'button',
	maxPlayers: 4,
	minPlayers: 4,
	initialState: 'game',
	lang: {
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
	},
	getController: function() {
		return OutAndSafeChallengeController.getInstance();
	},
	getModel: function(players, lang) {
		return new OutAndSafeChallenge(
			players,
			this[lang].title,
			this[lang].description,
			this.maxPlayers,
			this.minPlayers,
			this[lang].questions,
			this.initialState
		);
	}
};
