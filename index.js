import { CommandoClient } from 'discord.js-commando';
import path from 'path';

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
		['first', 'Your First Command Group'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'commands'));


client.on('ready', async () => {
  console.log(`${client.user.username} is online!`);
  client.user.setActivity('with itself');
});

client.on('error', console.error);

// client.on('message', async message => {
//   if(message.author.bot) return;
//   if(message.channel.type === 'dm') return;

// });

// TODO: get token from discord client to add here
client.login(process.env.CLIENT_TOKEN);
