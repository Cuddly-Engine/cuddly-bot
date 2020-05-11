
const botconfig = require("./botconfig.json");


import Discord from 'discord.js';

const client = new Discord.Client({disableEveryone: true});

// TODO: get token from discord client to add here
client.login(process.env.CLIENT_TOKEN);

client.on("ready", async () => {
  console.log(`${client.user.username} is online!`);
});

client.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if(message.content.includes('bee')) {
    return message.channel.send('!play https://www.youtube.com/watch?v=MADvxFXWvwE');
  }

  if (cmd === `${prefix}hello`) {
      return message.channel.send("hello!");
  }

});