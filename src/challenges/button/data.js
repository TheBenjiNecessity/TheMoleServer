import ButtonChallenge from './model';
import ButtonChallengeSocketHandler from './socket-handler';

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
		return ButtonChallengeSocketHandler.getInstance();
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
