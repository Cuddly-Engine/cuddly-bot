import Discord  from 'discord.js';


// ? Sends Message to default channel. General, announcements or first text channel in list. 
export const sendMessage = async (client, message) => {
    try {   

        // TODO allow users to set the channel for bot reminders / announcements. 

        // Tries to find channel containing keywords "announcements" or "general"
       let defaultChannel = await getDefaultChannel(client);

       defaultChannel.send(message);

        return true;
    } catch (error) {
            console.log(error);
        return false;
    }
};

// TODO Discord only allows 25 fields in an embed message. Maybe add 2 emoji responses for left and right arrows, and 
// TODO - allow the user to go from page to page of fields using the buttons.
// ? Sends a generic list. requires each item in "list" object to have two fields, title and description.
// ? You can have up to ** 25 fields ** before discord says nono
export const sendList = async (list, client) => {
    try {   
        if(!Array.isArray(list)) {
            console.log('ERROR, sendList parameter "list" must be an array. each item must contain {title: STRING, description: STRING }');
            return false;
        }     
        
        if(!list[0].title || !list[0].description) {
            console.log('ERROR, each item must contain {title: STRING, description: STRING }');
            return false;
        }

        if(typeof list[0].title !== 'string' || typeof list[0].description !== 'string') {
            console.log('ERROR title or description is not a string, each item must contain {title: STRING, description: STRING }');
            return false; 
        }

        // Tries to find channel containing keywords "announcements" or "general"
        let defaultChannel = await getMessagedChannel(client);

       const embedMessage = new Discord.MessageEmbed();

       list.forEach(item => {
            embedMessage.addField(item.title, item.description);
        }

       );
        defaultChannel.send(embedMessage);
        return true;
    } catch (error) {
            console.log(error);
        return false;
    }
};

// ? Reminder is different to sendMessage. It styles it in a specific format to suit reminders. With Discord embed feature.
export const sendReminder = async (client, authorName, authorAvatar, id, title, date, channel) => {
    try {   

        // TODO the way data is passed in here is a bit messy, but can't be changed easily atm.
        
        // If channel is not provided. Tries to find channel containing keywords "announcements" or "general"
        if(!channel)
            channel = getDefaultChannel(client);


        channel.send({embed: {
            author: {

                // TODO make the images locally stored.
                name: 'ID: ' + id,
                icon_url: 'https://i.imgur.com/uxZLrc7.png',
                //icon_url: 'https://i.imgur.com/cSL3Ok9.png',
                // If we add recurring reminders, we could put an icon here using icon_url: URL. To represent a recurring one
            },
            title: title,
            description:  new Date(date).toUTCString(),
            footer: {
                icon_url: authorAvatar,
                text: authorName,
            },
        }});

            return true;
    } catch (error) {
            console.log(error);
        return false;
    }
};

// ? Gets the general or announcements channel. if they do not exist, gets the first channel in list.
export const getDefaultChannel = async (client) => {
    try {
        // TODO or cache this so we don't have to keep finding a channel...

        let defaultChannel = client.channels.cache.find(channel =>    
            (channel.name.toLowerCase().includes('general') || channel.name.toLowerCase().includes('announcements'))
            && channel.type === 'text'      
        );

       // if they're extra difficult and don't have a welcome or general, get the first channel in list. 
       if(!defaultChannel) {
            defaultChannel = client.channels.cache.first();
            
            // If they have 0 text channels. They're dumb and we just aint gunna send a message
            if(defaultChannel) 
                return false;
       }

       return client;
    } catch (e) {
        console.log(e);
        return false;
    }
};

 // ? Gets the channel the user sent command to. Doesn't really need a function but iv came this far i might as well just do it like this.
export const getMessagedChannel = async (client) => {
    try {
        if(client.channels) {
            console.log('Pass the message object into getMessagedClient rather than client.');
            return false;
        }

        return client.channel;
    } catch (e) {
        console.log(e);
    }
    
};

// ? Gets custom emoji from Bot Playground server.
export const getEmoji = async (client, emojiName) => {
    try {
        if(typeof emojiName !== 'string') {
            console.log('EMOJINAME is not of type STRING. Give getEmoji(Client, STRING)');
            return false;
        }

        return client.guilds.cache.get('612751453840474128').emojis.cache.filter(emoji => emoji.name === emojiName).first();
    } catch (e) {
        console.log(e);
    }
};


// TODO actually understand the ramifications of a webhooks. All I know is that webhooks allow for multiple embeded messages in one, which will allow me to have multiple reminders in one message rather than spamming the user. 
export const sendWebhook = async (client, embed) => {
    try {   
        // ! This is not finished, and may never be finished. Was experimenting with webhooks. Remove at your own discretion
        // Tries to find channel containing keywords "announcements" or "general"
       let defaultChannel = await getDefaultChannel();
       const webhooks = await defaultChannel.fetchWebhooks();
       const webhook = webhooks.first();

       await webhook.send('Webhook test', {
            username: 'some-username',
            avatarURL: 'https://i.imgur.com/wSTFkRM.png',
            embeds: [embed],
        });

        return true;
    } catch (error) {
            console.log(error);
        return false;
    }
};