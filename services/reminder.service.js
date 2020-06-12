import schedule  from 'node-schedule';      
import { sendMessage } from '../services/bot.service';    

export const setReminder = async (client, dateText, reminder) => {
    try {

        console.log(dateText);

        const date = new Date("2020, 06, 12, 16, 48, 00, 00");

        schedule.scheduleJob(date, () => {
            sendMessage(client, reminder);
        });

        return 'I have set a reminder for ' + date.toUTCString() + '.';

    } catch (error) {
        console.log(error);
        return 'Something went wrong, pls contact my master.';
    }
};