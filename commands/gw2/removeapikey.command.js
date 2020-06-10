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

		if (isKey === 'key') {
			const response = await removeApiKeyByKey(result[0]);
			return message.say(response);
		} else if (isKey === 'name') {
			const response = await removeApiKeyByName(result[0]);
			return message.say(response);
		}

		return message.say('Name or API key does not exist to delete');
	}
};