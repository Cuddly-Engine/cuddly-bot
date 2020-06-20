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

            const embedPsna = new MessageEmbed()
                .setAuthor('PSNA (Pact Supply Network Agents)', 'https://render.guildwars2.com/file/5A4E663071250EC72668C09E3C082E595A380BF7/528724.png')
                .setColor(0x00f0f0)
                .setDescription(psna[index]);

            const embedPve = new MessageEmbed()
                .setAuthor('PVE', 'https://render.guildwars2.com/file/540BA9BB6662A5154BD13306A1AEAD6219F95361/102369.png')
                .setColor(0xff0000)
                .setDescription(pve.map(x => x.name.replace('Daily ', '')));

            const embedPvp = new MessageEmbed()
                .setAuthor('PVP', 'https://render.guildwars2.com/file/FE01AF14D91F52A1EF2B22FE0A552B9EE2E4C3F6/511340.png')
                .setColor(0x00ff00)
                .setDescription(pvp.map(x => x.name.replace('Daily PvP', '')));

            const embedWvw = new MessageEmbed()
                .setAuthor('WVW', 'https://render.guildwars2.com/file/2BBA251A24A2C1A0A305D561580449AF5B55F54F/338457.png')
                .setColor(0x0000ff)
                .setDescription(wvw.map(x => x.name.replace('Daily WvW', '')));

            const embedFractal = new MessageEmbed()
                .setAuthor('Fractal', 'https://render.guildwars2.com/file/620E0D3D2DD860700632BA7B3AC10C44CE55FD6C/1424206.png')
                .setColor(0xf0f000)
                .setDescription(fractal.filter(f => f.name.includes('Daily Tier 4') || f.name.includes('Daily Recommended')).map(f => f.name.replace('Daily Tier 4 ', '')));

            const messageList = [embedPsna, embedPve, embedPvp, embedWvw, embedFractal];

            if (resp.special.length > 0) {
                const special = await getDailyDetails(resp.special.map(x => x.id));
                const embedSpecial = new MessageEmbed()
                    .setAuthor('Specials', 'https://render.guildwars2.com/file/339192F5581BB3F771CF359BAB2C90537BD560CB/1228225.png')
                    .setColor(0x0f0f00)
                    .setDescription(special.map(x => x.name.replace('Daily ', '')));

                messageList.push(embedSpecial);
            }

            for (const list of messageList) {
                message.say(list);
            }

            return;
        } catch (err) {
            return message.say('An error has occurred in the GW2 API service');
        }
    }
};