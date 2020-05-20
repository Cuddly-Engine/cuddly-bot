import { Command } from 'discord.js-commando';
import { removeApiKey } from '../../services/apikey.service';
// @ts-check
module.exports = class RemoveKeyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'removekey',
			aliases: ['removekey'],
			group: 'base',
			memberName: 'removekey',
			description: 'Removes API key from list of known players',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	async run(message) {
		var result = message.argString.trim().split(" ");

		if (result.length > 1)
			return message.say("Error, recieved more than just the api key you dummy!");

		if (result.length === 0)
			return message.say("Error, recieved less than 1 arguements. Give me the APIKEY. Gosh");

		removeApiKey(result[0]).then(response => {
			if (!response)
				return message.say("Something went wrong. You broke me, congratulations, now put a correct name and apikey.");
			else
				// This may not be success. response could be error handling from inside the apikey service ^ (addApiKey function)
				return message.say(response);
		});
	}
};