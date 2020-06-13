import { Command } from 'discord.js-commando';
import { addApiKey } from '../../services/apikey.service';
// @ts-check
module.exports = class listKeysCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'listkeys',
			aliases: ['listkeys'],
			group: 'gw2',
			memberName: 'listkeys',
			description: 'List of names with keys inside bot keys list for guildwars 2.',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	async run() {
		
	}
};