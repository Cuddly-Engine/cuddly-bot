import { Command } from 'discord.js-commando';
import { addApiKey } from '../../services/apikey.service';
// @ts-check
module.exports = class AddKeyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'addkey',
			aliases: ['addkey'],
			group: 'base',
			memberName: 'addkey',
			description: 'Adds key to list of known players',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	async run(message) {

		var result = message.argString.trim().split(' ');

		if (result.length > 2)
			return message.say('Error, recieved more than just name and api key you dummy!');

		if (result.length < 2)
			return message.say('Error, recieved less than 2 arguements. Give me the NAME and APIKEY. Gosh');

		const response = await addApiKey(result[0], result[1]);
		// This may not be success. response could be error handling from inside the apikey service ^ (addApiKey function)
		return message.say(response);
	}
};