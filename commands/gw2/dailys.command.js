import { Command } from 'discord.js-commando';
import { getDailys, getFractals } from '../../services/gwapi.service';

module.exports = class DailysCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'gw.dailys',
            aliases: ['dailys'],
            group: 'gw2',
            memberName: 'dailys',
            description: 'Displays list of GW2 daily fractal scales.',
            throttling: {
                usages: 1,
                duration: 10,
            },
        });
    }

    async run(message) {
        const resp = await getDailys();
        const fracs = await getFractals(resp.fractals.map(f => f.id).join());
        const filteredFracs = fracs.filter(f => f.name.includes('Daily Tier 4') || f.name.includes('Daily Recommended'));
        return message.say(filteredFracs.map(f => f.name.replace('Daily Tier 4 ', '')));
    }
};