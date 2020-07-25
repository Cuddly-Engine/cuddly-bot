import { Command } from 'discord.js-commando';
import queue from '../../services/queue.service';

module.exports = class SkipCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            aliases: ['skip'],
            group: 'music',
            memberName: 'skip',
            description: 'Skips the current played song.',
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

        if (!serverQueue) {
            return message.channel.send('There is no song that I could skip!');
        }

        serverQueue.connection.dispatcher.end();
        return message.channel.send('Skipping song...');
    }
};