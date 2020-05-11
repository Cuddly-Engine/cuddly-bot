import { Command } from 'discord.js-commando';
import { getBreeds } from '../../services/api.service';


module.exports = class DogCommand extends Command {
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

	async run(message) {
		const resp = await getBreeds();
		return message.say(resp);
	}
};