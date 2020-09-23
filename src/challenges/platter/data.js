import PlatterChallengeController from './controller';
import PlatterChallenge from './model';

export default {
	type: 'platter',
	maxPlayers: 6,
	minPlayers: 4,
	initialState: 'game',
	lang: {
		en: {
			title: 'The Platter',
			description: '',
			questions: [
				{
					text: 'In the "Platter" challenge, did the mole take the exemption?',
					type: 'choices',
					choices: [ 'Yes', 'No' ]
				},
				{
					text: 'In the "Platter" challenge, in what position did the mole take points?',
					type: 'rank',
					choices: [ 'The mole did not take points' ]
				}
			]
		}
	},
	getController: function() {
		return PlatterChallengeController.getInstance();
	},
	getModel: function(players, lang) {
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
};
