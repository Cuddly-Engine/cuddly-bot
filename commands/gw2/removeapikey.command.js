import { Command } from 'discord.js-commando';
import { removeApiKeyByName, removeApiKeyByKey } from '../../services/apikey.service';
import { checkApiKeyExists } from '../../services/gwapi.service';
// @ts-check
module.exports = class RemoveKeyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'removekey',
			aliases: ['removekey'],
			group: 'gw2',
			memberName: 'removekey',
			description: 'Removes API key from list of known players',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	async run(message) {
		const result = message.argString.trim().split(' ');

		if (result.length > 1)
			return message.say('Error, recieved more than just the api key you dummy!');

		if (result[0] === '')
			return message.say('Error, recieved less than 1 arguements. Give me the APIKEY or NAME. Gosh');


		const isKey = await checkApiKeyExists(result[0]);

		if(isKey) {
			removeApiKeyByKey(result[0]).then(response => {
				if (!response)
				return message.say('Something went wrong. You broke me, congratulations, now put a correct name and apikey.');
			else
				// This may not be success. response could be error handling from inside the apikey service ^ (addApiKey function)
				return message.say(response.text);		
			});
		} else {
			removeApiKeyByName(result[0]).then(response => {
				if (!response)
					return message.say('Something went wrong. You broke me, congratulations, now put a correct name and apikey.');
				else

					// This may not be success. response could be error handling from inside the apikey service ^ (addApiKey function)
					return message.say(response.text);
			});
		}
	}
};