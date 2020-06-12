import schedule  from 'node-schedule';      
import { sendMessage } from '../services/bot.service';    

export const setReminder = async (client, dateText, reminder) => {
    try {
        const date = new Date(dateText);
        
        if(date.getTime() !== date.getTime()) // NaN is never equal to itself (according to google)
            return 'Invalid Date. Please give me a date in the following format: **MONTH DAY, YEAR TIME | MESSAGE**';

        schedule.scheduleJob(date, () => {
            sendMessage(client, reminder);
        });

        return 'I have set a reminder for ' + date.toUTCString() + '.';

    } catch (error) {
        return 'Something went wrong, pls contact my master.';
    }
};