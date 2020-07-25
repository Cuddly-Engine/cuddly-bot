import { Command } from 'discord.js-commando';
import { MessageEmbed } from 'discord.js';
import { getDailys, getDailyDetails } from '../../services/gwapi.service';

module.exports = class FractalsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'fractals',
            aliases: ['fractals'],
            group: 'gw2',
            memberName: 'fractals',
            description: 'Displays list of GW2 daily fractal.',
            throttling: {
                usages: 1,
                duration: 10,
            },
        });
    }

    async run(message) {
        const resp = await getDailys();
        const fracs = await getDailyDetails(resp.fractals.map(f => f.id).join());

        const embedFractal = new MessageEmbed()
            .setAuthor('Fractal', 'https://render.guildwars2.com/file/620E0D3D2DD860700632BA7B3AC10C44CE55FD6C/1424206.png')
            .setColor(0xf0f000)
            .setDescription(fracs.filter(f => f.name.includes('Daily Tier 4') || f.name.includes('Daily Recommended')).map(f => f.name.replace('Daily Tier 4 ', '')));

        return message.say(embedFractal);
    }
};