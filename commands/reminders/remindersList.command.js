import { Command } from 'discord.js-commando';    
import { listReminders } from '../../services/reminder.service';
import { sendList } from '../../services/bot.service';

module.exports = class ReminderListCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reminder-list',
			aliases: ['reminderlist', 'listreminder','listreminders','list-reminders','reminder-list','reminders','rl','lr', 'reminders-list'],
			group: 'base',
			memberName: 'reminder-list',
			description: 'Lists reminders set by this server.',
			throttling: {
				usages: 1, // This could easily be used for spam, so reduced amount of usages and increased duration.
				duration: 60,
			},
		});
	}

	async run(message) {
		const reminders = await listReminders(this.client);
		const list = [];

		reminders.forEach(reminder => {
			list.push({
				title: 'ID: ' + reminder.name + ' | Date: ' + new Date(reminder.date).toUTCString(),
				description: reminder.message,
			});
		});
		let errored = await sendList(list, message);

		if(!errored)
			return message.channel.send('Failed to send reminder list.');
	}
};