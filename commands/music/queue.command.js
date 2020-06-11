import { Command } from 'discord.js-commando';
import queue from '../../services/queue.service';

module.exports = class QueueCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'queue',
            aliases: ['queue'],
            group: 'music',
            memberName: 'queue',
            description: 'Lists the current song playlist.',
            throttling: {
                usages: 2,
                duration: 10,
            },
            guildOnly: true,
        });
    }

    async run(message) {
        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue.songs) {
            return message.channel.send('I\'m not currently playing any music.');
        }

        return message.say(serverQueue.songs.map((song, i) => `${i + 1}.    ${song.title}`));
    }
};
