import schedule  from 'node-schedule';      
import { sendMessage } from '../services/bot.service';    

export const setReminder = async (client, dateText, reminder) => {
    try {
        const date = new Date(dateText);
        
        if(date.getTime() !== date.getTime()) // NaN is never equal to itself (according to google)
            return 'Invalid Date. Example:  "June 12, 2020 16:57:00" ```~reminder MONTH DAY, YEAR TIME | MESSAGE ```';

        const reminderId = await generateIdReminder();
        schedule.scheduleJob(reminderId, date, () => {
            sendMessage(client, reminder);
        });

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

        job.cancel();

        return 'Reminder **' + id + '** has been cancelled.';

    } catch (error) {
        return 'Something went wrong cancelling the job, please contact the creators of this bot with a bug report.';
    }
};

export const listReminders = async () => {
    try {
        
        return Object.values(schedule.scheduledJobs).filter(job => job.name.includes('RE'));
    } catch (error) {
        console.log(error);
        return 'Unable to retrieve scheduled Reminders.';
    }
};


// Generates "ID" for reminder. for indexing reminders.
export const generateIdReminder = async () => {
    try {
        const list = schedule.scheduledJobs;

        return 'RE' + (Object.keys(list).length + 1);
    } catch (error) {
        return 'Unable to retrieve scheduled reminders.';
    }
};