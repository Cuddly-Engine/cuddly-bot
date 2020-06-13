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


		for(const reminder in reminders) {
			try {
				console.log(reminders[reminder]);
				// TODO add Username, User Image, Reminder message. This can be done once the messages are actually being stored locally.  

				message.channel.send({embed: {
					author: {
						name: new Date(reminders[reminder].nextInvocation()).toUTCString(),
					  },
					title: reminders[reminder].name,
				}});
			} catch (error) {
				// Some reminders for one reason or another -might- be missing information, causing it to break.

				console.log(error);
				message.channel.send('Something went wrong processing one of the reminders. Let my masters know this happened.');
			}
		}
	}
};