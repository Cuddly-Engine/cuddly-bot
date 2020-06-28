import { Command } from 'discord.js-commando';    
import { setReminder, cancelReminder } from '../../services/reminder.service';
import { getEmoji } from '../../services/bot.service';

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

		// ? Welcome to what I like to call ** Spaghetti Code Saturdays ** (Except I coded it on sunday)

		// ? Loading the emojis into variables so I don't have to call getEmoji twice for each one.
		const recurringReaction = await getEmoji(this.client, 'recurring');
		const everyhour = await getEmoji(this.client, 'everyhour');
		const everyday = await getEmoji(this.client, 'everyday');
		const everyweek = await getEmoji(this.client, 'everyweek');
		const everyfortnight = await getEmoji(this.client, 'everyfortnight');
		const everymonth = await getEmoji(this.client, 'everymonth');
		const cancel = await getEmoji(this.client, 'cancel');

		// Reacting with the initial Recurring Emoji.
		await m.react(recurringReaction);

		// React with cancel emoji.
		await m.react(cancel);
		
		// Listener constructor. Pass in the emoji you want to listen for
		const listenFor = (emoji) => {
			return (reaction, user) => {
				return reaction.emoji === emoji && user.id === message.author.id;
			};
		};
		
		// Initialisation of the actual listeners in discord.js. time = amount of milliseconds till it timesout.
		const recurringcollector = m.createReactionCollector(listenFor(recurringReaction), { time: 15000 });
		// listeners for further emojis shown once recurring is clicked.
		const everyhourcollector = m.createReactionCollector(listenFor(everyhour), { time: 15000 });
		const everydaycollector = m.createReactionCollector(listenFor(everyday), { time: 15000 });
		const everyweekcollector = m.createReactionCollector(listenFor(everyweek), { time: 15000 });
		const everyfortnightcollector = m.createReactionCollector(listenFor(everyfortnight), { time: 15000 });
		const everymonthcollector = m.createReactionCollector(listenFor(everymonth), { time: 15000 });
		const cancelcollector = m.createReactionCollector(listenFor(cancel), { time: 15000 });


		// ? Listen Collector for cancel emoji. On react by author of reminder, the reminder will be cancelled. 
		cancelcollector.on('collect', async (reaction, user) => {
			let response = await cancelReminder(returnedReminder.id);

			message.say(response);
		});	

		recurringcollector.on('collect', async (reaction, user) => {

			// Reacts with emojis for customisation of recurring. 
			// TODO reactions take a long time to appear. WHY??? 
			await m.react(everyhour);
			await m.react(everyday);
			await m.react(everyweek);
			await m.react(everyfortnight);
			await m.react(everymonth);
		});
	
		everyhourcollector.on('collect', async (reaction, user) => {
			// TODO 
		});	
		
		everydaycollector.on('collect', async (reaction, user) => {
			// TODO 
		});	

		everyweekcollector.on('collect', async (reaction, user) => {
			// TODO 	
		});	

		everyfortnightcollector.on('collect', async (reaction, user) => {
			// TODO 
		});	

		everymonthcollector.on('collect', async (reaction, user) => {
			// TODO 
		});	

		recurringcollector.on('end', async () => {
			// TODO Actually make it recurring once this is hit. Recurring is not currently implemented. 
			// On time out to clicking the recurring emoji. Once this is hit, the user should no longer be able to edit the recurring settings.

			//	await sendReminder(this.client, returnedReminder.authorUsername, returnedReminder.authorAvatar, returnedReminder.id, returnedReminder.message, returnedReminder.date, await getMessagedChannel(message));
		});
	}
};