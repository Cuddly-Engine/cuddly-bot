import { Command } from 'discord.js-commando';
import { gw2 } from '../../services/api.service';


module.exports = class BeeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dogs',
			aliases: ['dogs'],
			group: 'base',
			memberName: 'dogs',
			description: 'Replies with a random image of a dog',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
    }
    
    run(message) {
		
		let e = new gw2();

		e.getBreeds().then((result) => {
			return message.say(result);
		});
	}
};