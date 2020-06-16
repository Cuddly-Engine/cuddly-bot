import schedule  from 'node-schedule';      
import { sendReminder } from '../services/bot.service';    
import Reminder from '../model/reminder';
import fs from 'fs';

export const setReminder = async (client, dateText, reminder, author) => {
    try {
        const date = new Date(dateText);
        
        if(date < new Date())
            return 'DateTime must be in the future!';

        if(date.getTime() !== date.getTime()) // NaN is never equal to itself (according to google)
            return 'Invalid Date. Example:  "June 12, 2020 16:57:00" ```~reminder MONTH DAY, YEAR TIME | MESSAGE ```';

        const reminderId = await generateIdReminder();
        
        const job = schedule.scheduleJob(reminderId, date, () => {
            sendReminder(client, author.username, author.displayAvatarURL(), reminder.name, reminder.message, reminder.date);
        });
        const reminderSaved = await saveReminder(author, job, reminder, date);

        if(!reminderSaved) {
            schedule.cancelJob(reminderId);
            return 'Reminder failed to save. Removed reminder from the schedule to prevent duplication. If this persists please contact my masters.';
        }

        return 'I have set a reminder with id **' + reminderId + '** for ' + date.toUTCString() + '. ``` You will need the id ' + reminderId + ' if you wish to delete or edit the reminder. ```';

    } catch (error) {
        return 'Something went wrong, pls contact my master.';
    }
};

export const cancelReminder = async (id) => {
    try {
        const job = schedule.scheduledJobs[id];
        
        if(!job)
            return 'Invalid ID, try again. ```~reminder-cancel ID```';
        try {
            const data = await fs.readFileSync('./data/reminders.json');
            const file = JSON.parse(data);
    
            const newFile = file.filter(reminder =>  reminder.name !== id);
    
            const json = JSON.stringify(newFile);
    
            // Rewrite json with updated reminders.
            fs.writeFileSync('./data/reminders.json', json);
        } catch (e) {
            console.log(e);
            return 'Unable to rewrite reminders to file. Something went wrong!';
        }

        job.cancel();

        return 'Reminder **' + id + '** has been cancelled.';

    } catch (error) {
        return 'Something went wrong cancelling the job, please contact the creators of this bot with a bug report.';
    }
};

export const listReminders = async () => {
    try {
        const data = await fs.readFileSync('./data/reminders.json');
        const file = JSON.parse(data);

        return file;
    } catch (error) {
        console.log(error);
        return 'Unable to retrieve scheduled Reminders.';
    }
};


// Generates "ID" for reminder. for indexing reminders.
export const generateIdReminder = async () => {
    try {
        const list = schedule.scheduledJobs;

        return 'RE' + (Object.keys(list).length);
    } catch (error) {
        return 'Unable to retrieve scheduled reminders.';
    }
};

export const saveReminder = async (client, job, message, date) => {
    try {
                                                
        let reminder = await new Reminder(client.username, client.displayAvatarURL(), message, date);
        reminder = {...reminder, ...job};

        const data = await fs.readFileSync('./data/reminders.json');
        const file = JSON.parse(data);

        file.push(reminder);
        const json = JSON.stringify(file);

        // Rewrite json with updated reminders.
        fs.writeFileSync('./data/reminders.json', json);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const setRemindersOnStart = async (client) => {
    try {
        const data = fs.readFileSync('./data/reminders.json');
        const file = JSON.parse(data);
        
        let removedDates = 0; // Counting the amount of dates removed due to out of dateness.
        let setDates = 0; // Record of how many reminders have been set up on startup.

         file.forEach((reminder, index) => {

            // Checking date is not older than today (whenever bot is booted up).
            if(new Date(reminder.date) < new Date()) {
                removedDates++;
                file.splice(index, 1);
            } else {
                schedule.scheduleJob(reminder.name, reminder.date, () => {
                    sendReminder(client, reminder.username, reminder.userimage, reminder.name, reminder.message, reminder.date);
                });
                setDates++;
            }
         });
         
         const json = JSON.stringify(file);

         // Rewrite json with updated reminders.
         fs.writeFileSync('./data/reminders.json', json);

         console.info('\x1b[33m', `warning: removed ${removedDates} reminders due to them being out of date.`);


         // Log in console that the reminders have been loaded on startup.
         console.info('\x1b[36m%s\x1b[0m', ` ${setDates} reminders successfully loaded on launch!`);


        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};