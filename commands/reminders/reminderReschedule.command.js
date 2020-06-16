import { Command } from 'discord.js-commando';    
import { cancelReminder } from '../../services/reminder.service';
module.exports = class ReminderReschedule extends Command {
	constructor(client) {
		super(client, {
			name: 'reminder-reschedule',
			aliases: ['reminder-reschedule', 'reminder-change', 'reminder-date'],
			group: 'base',
			memberName: 'reminder-reschedule',
			description: 'Change the date of a reminder.',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	async run(message) {
	
		const reminder = message.argString.trim();

		const args = reminder.split(' ');

		if(args.length < 2)
			return message.say('Please provide an ID and a Date. ```~reminder-reschedule DATE | ID ```');

		return message.say( await cancelReminder(args[0] /* ID */ ));
	}
};