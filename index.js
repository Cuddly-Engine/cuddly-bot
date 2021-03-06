import { CommandoClient } from 'discord.js-commando';
import path from 'path';
import { setRemindersOnStart } from './services/reminder.service';
import queue from './services/queue.service';


const client = new CommandoClient({
  commandPrefix: '~',
  owner: [
    '100317151008657408',
    '87683763546378240',
  ],
  //invite: 'https://discord.gg/bRCvFy9',
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['base', 'Base discord commands unrelated to any specific area.'],
    ['music', 'Music bot commands.'],
    ['gw2', 'Guild Wars 2 commands.'],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', async () => {
  console.log(`${client.user.username} is online!`);

  client.user.setActivity('celebrating pet fish birthday');

  let setReminders = await setRemindersOnStart(client);

  if(!setReminders) 
    console.error('Failed to set reminders on launch. Suggest Restart');
  client.user.setActivity('with a DOOB | ~help');
});

client.on('voiceStateUpdate', async (oldState, newState) => {
  if (!newState.channelID) {
    queue.delete(oldState.guild.id);
  }
});

client.on('error', console.error);

// TODO: get token from discord client to add here
client.login(process.env.CLIENT_TOKEN);