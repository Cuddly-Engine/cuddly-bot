import schedule  from 'node-schedule';      
import { sendReminder } from '../services/bot.service';    
import Reminder from '../model/reminder';
import fs from 'fs';

export const setReminder = async (client, dateText, reminder, author) => {
    try {

        // TODO allow for no year or date in line. Currently defaults year to like 0000 and date to 1st of Jan if they aren't present.

        const date = new Date(dateText);
        
        if(date < new Date())
            return 'The Date you have given me is in the past. It must be in the future!';

        if(date.getTime() !== date.getTime()) // NaN is never equal to itself (according to google)
            return 'Invalid Date. Example:  "June 12, 2020 16:57:00" ```~reminder MONTH DAY, YEAR TIME | MESSAGE ```';

        const reminderId = await generateIdReminder();

        if(!reminderId)
            return 'Error setting event. Something went wrong with saving the ID. Please contact my creators.';

        const job = schedule.scheduleJob(reminderId, date, () => {
            sendReminder(client, author.username, author.displayAvatarURL(), reminderId, reminder.message, date);
        });

        const reminderSaved = await saveReminder(author, job, reminder, date);

        if(!reminderSaved) {
            schedule.cancelJob(reminderId);
            return 'Reminder failed to save. Removed reminder from the schedule to prevent duplication. If this persists please contact my masters.';
        }
        
        // If successful, return the reminder object so it can be further used. 
        return {authorUsername: author.username, authorAvatar: author.displayAvatarURL(), id: reminderId, message: reminder, date: date };

    } catch (error) {
        return 'Something went wrong, pls contact my master.';
    }
};

// Cancels reminder from scheduledJobs.
export const cancelReminder = async (id) => {
    try {
        const job = schedule.scheduledJobs[id];
        
        if(!job)
            return 'Invalid ID, try again. ```~reminder-cancel ID```';

        let deleted = await deleteReminder(id);

        if(!deleted)
            return 'Error deleting reminder from storage. Please contact my creators if this persists.';

        job.cancel();

        return 'Reminder **' + id + '** has been cancelled.';

    } catch (error) {
        return 'Something went wrong cancelling the reminder,  please contact my creators if this persists.';
    }
};


// Deletes Reminder from stored Data File.
export const deleteReminder = async (id) => {
    try {
        const data = fs.readFileSync('./data/reminders.json');
        const file = JSON.parse(data);

        const newFile = file.filter(reminder =>  reminder.name !== id);

        const json = JSON.stringify(newFile);

        // Rewrite json with updated reminders.
        fs.writeFileSync('./data/reminders.json', json);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};

export const rescheduleReminder = async (dateText, id, author) => {
    try {
        const data = await fs.readFileSync('./data/reminders.json');
        const file = JSON.parse(data);
        const storedReminder = file.filter(reminder => reminder.name === id);
        if(storedReminder.length <= 0)
            return `No reminder exists with ID ${id}.`+'``` Check your reminders using: ~reminder-list ```';

        const date = new Date(dateText);
        
        if(date < new Date())
            return 'DateTime must be in the future!';

        if(date.getTime() !== date.getTime()) // NaN is never equal to itself (according to google)
            return 'Invalid Date. Example:  "June 12, 2020 16:57:00" ```~reminder MONTH DAY, YEAR TIME | MESSAGE ```';

        const job = schedule.rescheduleJob(id, date);

        if(!job)
            return 'failed to reschedule Reminder. Please check your message format and try again. If this persists please contact one of my creators.';

        // Delete old reminder from database.
        await deleteReminder(id);

        const reminderSaved = await saveReminder(author, job, storedReminder.message, date);

        if(!reminderSaved) {
            schedule.cancelJob(id);
            return 'Reminder failed to save. Removed reminder from the schedule to prevent duplication. If this persists please contact my creators.';
        }

        return `I have rescheduled reminder **${id}** to **${date.toUTCString()}**. You will need ID ${id} to make further changes.`;

    } catch (error) {
        return 'Something went wrong, pls contact my master.';
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
export const generateIdReminder = async (i = 0) => {
    try {
        // TODO this can all go once a actual database is in place. Generating primary keys for each reminder. RE + number

        const list = schedule.scheduledJobs;
        const ID = (Object.keys(list).length) + i;

         // Prevent IDs from being the same if an earlier reminder is removed. 
        if(Object.keys(list).filter(r => r === 'RE' + ID).length > 0)
            return generateIdReminder(i + 1);

           return 'RE' + (ID);
    } catch (error) {
        return false;
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


         // Log in console how many reminders have been removed due to being out of date.
         console.info('\x1b[33m', `warning: removed ${removedDates} reminders due to them being out of date.`);


         // Log in console that the reminders have been loaded on startup.
         console.info('\x1b[36m%s\x1b[0m', ` ${setDates} reminders successfully loaded on launch!`);


        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};