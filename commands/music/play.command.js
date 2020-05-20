import { Command } from 'discord.js-commando';
import ytdl from 'ytdl-core';
import queue from '../../services/queue.service';

module.exports = class PlayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            aliases: ['play'],
            group: 'music',
            memberName: 'play',
            description: 'Plays a song from Youtube.',
            throttling: {
                usages: 1,
                duration: 100,
            },
            guildOnly: true,
        });
    }

    async run(message) {
        const args = message.content.split(' ');

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.channel.send('You need to be in a voice channel to play music!');
        }

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return message.channel.send('I need the permissions to join and speak in your voice channel!');
        }

        if (!args[1]) {
            return message.say('Please enter a song to play!');
        }

        let songInfo;

        try {
            songInfo = await ytdl.getInfo(args[1]);
        } catch (error) {
            return message.say('Could not find song!');
        }

        const song = {
            title: songInfo.title,
            url: songInfo.video_url,
        };

        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) {
            const queueContract = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
            };

            queue.set(message.guild.id, queueContract);
            queueContract.songs.push(song);

            try {
                var connection = await voiceChannel.join();
                queueContract.connection = connection;

                this.play(message.guild, queueContract.songs[0]);
            } catch (err) {
                console.log(err);
                queue.delete(message.guild.id);
                return message.channel.send(err);
            }
        }
        else {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            return message.channel.send(`${song.title} has been added to the queue!`);
        }

        return message.say(song.title);
    }

    async play(guild, song) {
        const serverQueue = queue.get(guild.id);
        if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }

        const dispatcher = await serverQueue.connection
            .play(ytdl(song.url))
            .on('finish', () => {
                serverQueue.songs.shift();
                this.play(guild, serverQueue.songs[0]);
            })
            .on('error', error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        serverQueue.textChannel.send(`Start playing: **${song.title}**`);
    }
};