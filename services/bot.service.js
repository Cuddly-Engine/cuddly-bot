

// ? Sends Message to default channel. General, announcements or first text channel in list. 
export const sendMessage = async (client, message) => {
    try {   

        // TODO allow users to set the channel for bot reminders / announcements. 
        // TODO or cache this so we don't have to keep finding a channel...

        // Tries to find channel containing keywords "announcements" or "general"
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

       defaultChannel.send(message);

        return true;
    } catch (error) {
            console.log(error);
        return false;
    }
};

// ? Reminder is different to sendMessage. It styles it in a specific format to suit reminders. With Discord embed feature.
export const sendReminder = async (client, authorName, authorAvatar, id, title, date) => {
    try {   

        // TODO the way data is passed in here is a bit messy, but can't be changed easily atm.

        // Tries to find channel containing keywords "announcements" or "general"
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

       defaultChannel.send({embed: {
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