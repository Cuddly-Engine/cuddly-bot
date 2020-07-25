
import { Job } from 'node-schedule';

module.exports = class Reminder extends Job {
	constructor(Username, Userimage, Message, ReminderDate) {
        super();
                this.username = Username;
                this.userimage = Userimage;
                this.message = Message;
                this.date = ReminderDate;
	}

  };
  