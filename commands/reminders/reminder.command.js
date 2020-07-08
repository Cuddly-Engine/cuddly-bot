import { Command } from 'discord.js-commando';    
import { setReminder, cancelReminder } from '../../services/reminder.service';
import { getEmoji } from '../../services/bot.service';

module.exports = class ReminderCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reminder',
			aliases: ['reminder', 'r', 'reminder-set', 'set-reminder', 'setreminder', 'ar', 'sr', 'test'],
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

		// ? Welcome to what I like to call ** Spaghetti Code Saturdays ** (Except I coded it on sunday)

		// ? Loading the emojis into variables so I don't have to call getEmoji twice for each one.
			// ! This won't work because iv removed the bot from bot playground discord while i fix the bot working on multiple discords at same timep5.BandPass()
		// const recurringReaction = await getEmoji(this.client, 'recurring');
		// const cancel = await getEmoji(this.client, 'cancel');
	
		// Listener constructor. Pass in the emoji you want to listen for
		const listenFor = (emoji) => {
			return (reaction, user) => {
				// ! Once the custom cancel emoji back ^^^ .name will need to be removed. as it is comparing the ascii rather than the emoji object. 
				return reaction.emoji.name === emoji && user.id === message.author.id;
			};
		};
		
		const cancelcollector = m.createReactionCollector(listenFor('⛔'), { time: 15000 });


		// ? Listen Collector for cancel emoji. On react by author of reminder, the reminder will be cancelled. 
		cancelcollector.on('collect', async (reaction, user) => {
			let response = await cancelReminder(returnedReminder.id);

			message.say(response);
		});	

		// Reacting with the initial Recurring Emoji.
		await m.react('⛔');
		// React with cancel emoji.
		await m.react('⛔');
	}
};