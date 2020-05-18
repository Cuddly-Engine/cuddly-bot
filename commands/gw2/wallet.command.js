import { Command } from 'discord.js-commando';
import { getBankAmount, getCurrencyType } from '../../services/gwapi.service';
// @ts-check
module.exports = class WorldBossesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gw.wallet',
			aliases: ['wallet'],
			group: 'base',
			memberName: 'wallet',
			description: 'Replies with a random image of a dog',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	async run(message) {
		console.log("1")
		const bank = await getBankAmount();
		console.log("2")
		let wallet = [];

		await getCurrencyType().then(currencies => { // currency types from gw2 api
			currencies.forEach(currency => { // for each currency in currency types
				bank.filter(usersCurrency => { // grab currency by id from users bank where id is same as currency from currency type ^ 
					if(usersCurrency.id === currency.id) {
						// If 'Coin' type, put decimal place after gold amount. then place each currency type into a string "name: value". Coin type is named 'Gold' instead. 
						if(currency.name === 'Coin') {
							usersCurrency.value = usersCurrency.value / 10000;

							wallet.push("Gold: " + ": " + usersCurrency.value);
						} else {
							wallet.push(currency.name + ": " + usersCurrency.value);
						}
					}
				});
			});
		});
		
		return message.say(wallet);
	}
};