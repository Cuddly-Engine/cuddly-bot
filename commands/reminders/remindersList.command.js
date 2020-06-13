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
				usages: 1, // This could easily be used for spam, so reduced amount of usages and increased duration.
				duration: 60,
			},
		});
	}

	async run(message) {

		const reminders = await listReminders(this.client);
		const embeds = [];

		reminders.forEach(reminder => {
				message.channel.send({embed: {
				author: {
					name: 'ID: ' + reminder.name,
					// If we add recurring reminders, we could put an icon here using icon_url: URL. To represent a recurring one
				},
				title: new Date(reminder.date).toUTCString(),
				description:  reminder.message,
				footer: {
					icon_url: reminder.userimage,
					text: reminder.username,
				},
				}});
		});


	}
};