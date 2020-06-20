import { Command } from 'discord.js-commando';
import { MessageEmbed } from 'discord.js';
import moment from 'moment';
import { getDailys, getDailyDetails } from '../../services/gwapi.service';

module.exports = class DailysCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dailys',
            aliases: ['dailys', 'daily', 'dailies'],
            group: 'gw2',
            memberName: 'dailys',
            description: 'Displays list of GW2 daily achievements.',
            throttling: {
                usages: 1,
                duration: 10,
            },
        });
    }

    async run(message) {
        const psna = [
            ['[&BBABAAA=]', '[&BJIBAAA=]', '[&BLkCAAA=]', '[&BH8HAAA=]', '[&BBEDAAA=]', '[&BEICAAA=]'], // sunday
            ['[&BIcHAAA=]', '[&BEwDAAA=]', '[&BNIEAAA=]', '[&BKYBAAA=]', '[&BIMCAAA=]', '[&BA8CAAA=]'], // monday
            ['[&BH8HAAA=]', '[&BEgAAAA=]', '[&BKgCAAA=]', '[&BBkAAAA=]', '[&BGQCAAA=]', '[&BIMBAAA=]'], // tuesday
            ['[&BH4HAAA=]', '[&BMIBAAA=]', '[&BP0CAAA=]', '[&BKYAAAA=]', '[&BDgDAAA=]', '[&BPEBAAA=]'], // wednesday
            ['[&BKsHAAA=]', '[&BE8AAAA=]', '[&BP0DAAA=]', '[&BIMAAAA=]', '[&BF0GAAA=]', '[&BOcBAAA=]'], // thursday
            ['[&BJQHAAA=]', '[&BMMCAAA=]', '[&BJsCAAA=]', '[&BNUGAAA=]', '[&BHsBAAA=]', '[&BNMAAAA=]'], // friday
            ['[&BH8HAAA=]', '[&BLkCAAA=]', '[&BBEDAAA=]', '[&BJIBAAA=]', '[&BEICAAA=]', '[&BBABAAA=]'] // saturday
        ];

        const index = moment().subtract(8, 'h').subtract(30, 'm').day();

        const resp = await getDailys();
        try {
            const [pve, pvp, wvw, fractal] = await Promise.all([
                getDailyDetails(resp.pve.map(x => x.id)),
                getDailyDetails(resp.pvp.map(x => x.id)),
                getDailyDetails(resp.wvw.map(x => x.id)),
                getDailyDetails(resp.fractals.map(x => x.id)),
            ]);

            let special;

            if (resp.special.length > 0) {
                special = await getDailyDetails(resp.special.map(x => x.id));
            }

            const embedPsna = new MessageEmbed()
                .setAuthor('GW2 Daily Achievements', 'https://render.guildwars2.com/file/5A4E663071250EC72668C09E3C082E595A380BF7/528724.png')
                .setColor(0x00f0f0)
                .addField('PNSA (Pact Supply Network Agent)', psna[index])
                .addField('PvE', pve.map(x => x.name.replace('Daily ', '')))
                .addField('PvP', pvp.map(x => x.name.replace('Daily PvP', '')))
                .addField('WvW', wvw.map(x => x.name.replace('Daily WvW', '')))
                .addField('Fractals', fractal.filter(f => f.name.includes('Daily Tier 4') || f.name.includes('Daily Recommended')).map(f => f.name.replace('Daily Tier 4 ', '')))
                .addField('Festivals', resp.special.length > 0 ? special.map(x => x.name.replace('Daily ', '')) : 'No current festivals');

            return message.say(embedPsna);
        } catch (err) {
            return message.say('An error has occurred in the GW2 API service');
        }
    }
};