import { Command } from 'discord.js-commando';    
import { setReminder } from '../../services/reminder.service';
module.exports = class ReminderCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reminder',
			aliases: ['reminder'],
			group: 'base',
			memberName: 'reminder',
			description: 'Sets reminder which will then appear in Discord at specified time.',
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
			return message.say('Failed to split the date and message. use the **|** symbol. Example :" **MONTH DAY, YEAR TIME | MESSAGE** "');		


		return message.say( await setReminder(this.client /* The discord client */, args[0].trim() /* Date */, args[1].trim() /* Reminder Message */));
	}
};