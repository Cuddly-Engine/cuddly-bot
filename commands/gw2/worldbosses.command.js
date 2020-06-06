import { Command } from 'discord.js-commando';
import { getWorldBosses } from '../../services/gwapi.service';

module.exports = class WorldBossesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gw worldbosses',
			aliases: ['gw2'],
			group: 'gw2',
			memberName: 'gw2',
			description: 'Displays list of GW2 World Bosses',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	async run(message) {
		const resp = await getWorldBosses();

		return message.say(resp);
	}
};