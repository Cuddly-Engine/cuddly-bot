import { Command } from 'discord.js-commando';    
import { listReminders } from '../../services/reminder.service';
module.exports = class ReminderListCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reminder-list',
			aliases: ['reminderlist'],
			group: 'base',
			memberName: 'reminder-list',
			description: 'Sets reminder which will then appear in Discord at specified time.',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	async run(message) {
		return message.say(await listReminders(this.client));
	}
};