import { Command } from 'discord.js-commando';    
import { setReminder } from '../../services/reminder.service';
import { getEmoji, sendReminder, getMessagedChannel } from '../../services/bot.service';

module.exports = class ReminderCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reminder',
			aliases: ['reminder', 'r', 'reminder-set', 'set-reminder', 'setreminder', 'ar', 'sr'],
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
			return message.say('Failed to split the date and message. use the **|** symbol. ```~reminder MONTH DAY, YEAR TIME | MESSAGE ```');		


		const returnedReminder = await setReminder(this.client /* The discord client */, args[0].trim() /* Date */, args[1].trim() /* Reminder Message */, message.author);

		// If error message.
		if(typeof returnedReminder === 'string') {
			await message.say(reminder);
			return false;
		}

		const m = await message.say('I have set a reminder with id **' + returnedReminder.id + '** for ' + returnedReminder.date.toUTCString() + '. ``` You will need the id ' + returnedReminder.id + ' if you wish to delete or edit the reminder. ```');

		const recurringReaction = await getEmoji(this.client, 'recurring');

		m.react(recurringReaction);
		
		const filter = (reaction, user) => {
			return reaction.emoji === recurringReaction && user.id === message.author.id;
		};
		
		// CONTINUE HERE. ADDed CUSTOM EMOJI REACTION WITH LISTENER.

		const collector = m.createReactionCollector(filter, { time: 1 });
		
		collector.on('collect', (reaction, user) => {
		
			// TODO LISTENER TRIGGERED JUST HERE. TODO MAKE REMINDER RECURRING
		
			message.say('Reminder set to recurring.');
		});
		
		console.log(returnedReminder);
		
		collector.on('end', async () => {

		

			await sendReminder(this.client, returnedReminder.authorUsername, returnedReminder.authorAvatar, returnedReminder.id, returnedReminder.message, returnedReminder.date, await getMessagedChannel(message));
		});
	}
};