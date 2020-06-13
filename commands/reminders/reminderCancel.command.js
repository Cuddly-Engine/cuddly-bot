import { Command } from 'discord.js-commando';    
import { cancelReminder } from '../../services/reminder.service';
module.exports = class ReminderCancelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reminder-cancel',
			aliases: ['reminder-cancel', 'reminder-delete'],
			group: 'base',
			memberName: 'reminder-cancel',
			description: 'Sets reminder which will then appear in Discord at specified time.',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	async run(message) {
	
		const reminder = message.argString.trim();

		const args = reminder.split(' ');

		return message.say( await cancelReminder(args[0] /* ID */ ));
	}
};