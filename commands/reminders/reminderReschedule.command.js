import { Command } from 'discord.js-commando';    
import { cancelReminder, rescheduleReminder } from '../../services/reminder.service';
module.exports = class ReminderReschedule extends Command {
	constructor(client) {
		super(client, {
			name: 'reminder-reschedule',
			aliases: ['reminder-reschedule', 'reminder-change', 'reminder-date', 'reminderreschedule', 're-reminder','reschedule-reminder', 'change-reminder','reminderchange','reminderdate', 'rr'], // lol i'm just trying to predict the user yanno
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

		const args = reminder.split('|');

		if(args.length < 2)
			return message.say('Please provide a date and ID of reminder you wish to reschedule split by a Vertical bar, format: ```~reminder-reschedule DATE | ID ```');

		if(args.length >= 3)
			return message.say('More than two arguements given. Please make you are not using Vertical bar | anywhere other than to split date and ID');

		return message.say( await rescheduleReminder(args[0].trim() /* DATE */, args[1].trim() /* ID */, message.author));
	}
};