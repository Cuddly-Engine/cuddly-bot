import { Command } from 'discord.js-commando';
import queue from '../../services/queue.service';

module.exports = class StopCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            aliases: ['stop'],
            group: 'music',
            memberName: 'stop',
            description: 'Stops the bot from playing music.',
            throttling: {
                usages: 2,
                duration: 10,
            },
            guildOnly: true,
        });
    }

    async run(message) {
        const serverQueue = queue.get(message.guild.id);

        if (!message.member.voice.channel) {
            return message.channel.send('You have to be in a voice channel to stop the music!');
        }

        if (!serverQueue.connection.dispatcher) {
            return message.channel.send('I\'m not currently playing any music.');
        }

        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        return message.say('Stopping music...');
    }
};