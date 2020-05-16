import { Command } from 'discord.js-commando';
import queue from '../../services/queue.service';

module.exports = class SummonCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'summon',
            aliases: ['summon'],
            group: 'music',
            memberName: 'summon',
            description: 'Summons the bot to the current channel.',
            throttling: {
                usages: 2,
                duration: 10,
            },
            guildOnly: true,
        });
    }

    async run(message) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.say('You need to be in a voice channel to play music!');
        }

        const serverQueue = queue.get(message.guild.id);
        if (!serverQueue.songs) {
            return message.say('Not currently playing music. Use ~play {URL} to play some tunes!');
        }

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return message.say('I need the permissions to join and speak in your voice channel!');
        }

        await voiceChannel.join();
        return message.say(`Joining ${message.channel}`);
    }
};