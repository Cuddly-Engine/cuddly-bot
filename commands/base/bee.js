import { Command } from 'discord.js-commando';

module.exports = class BeeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bee',
			aliases: ['bee'],
			group: 'first',
			memberName: 'bee',
			description: 'Replies with a ram ranch',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
    }
    
    run(message) {
		return message.say('!play https://www.youtube.com/watch?v=MADvxFXWvwE');
	}
};