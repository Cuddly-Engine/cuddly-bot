import { Command } from 'discord.js-commando';
import { getQuaggans, getQuaggan } from '../../services/gwapi.service';

module.exports = class QuagganCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'quaggan',
            aliases: ['quaggan'],
            group: 'gw2',
            memberName: 'quaggan',
            description: 'Displays a random quaggan.',
            throttling: {
                usages: 1,
                duration: 10,
            },
        });
    }

    async run(message) {
        const resp = await getQuaggans();

        const qIndex = Math.floor(Math.random() * resp.length) + 1;
        const quag = resp[qIndex];

        const result = await getQuaggan(quag);

        return message.say(result.url);
    }
};