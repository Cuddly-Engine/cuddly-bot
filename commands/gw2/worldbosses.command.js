import { Command } from 'discord.js-commando';
import { getWorldBosses } from '../../services/gwapi.service';


module.exports = class WorldBossesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gw.worldbosses',
			aliases: ['dog'],
			group: 'base',
			memberName: 'dog',
			description: 'Replies with a random image of a dog',
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