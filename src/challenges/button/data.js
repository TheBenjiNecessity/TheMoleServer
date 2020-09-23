import ButtonChallengeController from './controller';
import ButtonChallenge from './model';

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
		return ButtonChallengeController.getInstance();
	},
	getModel: function(players, lang) {
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
};
