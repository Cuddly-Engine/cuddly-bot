import { Command } from 'discord.js-commando';
import { getBankAmount, getCurrencyType } from '../../services/gwapi.service';
import { getApiKey } from '../../services/apikey.service';
// @ts-check
module.exports = class WalletCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wallet',
			aliases: ['wallet'],
			group: 'base',
			memberName: 'wallet',
			description: 'Gets guild wars 2 wallet information of user.',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	async run(message) {

		let result = message.argString.trim().split(' ');

		let apikey = await getApiKey(result[0]);

		if (apikey.error)
			return message(apikey.text);

		const bank = await getBankAmount(apikey.text.key);
		let wallet = [];

		const currencies = await getCurrencyType();
		for (let currency of currencies) {
			for (let userCurrency of bank) {
				if (userCurrency.id === currency.id) {
					// If 'Coin' type, put decimal place after gold amount. then place each currency type into a string "name: value". Coin type is named 'Gold' instead. 
					if (currency.name === 'Coin') {
						const number = userCurrency.value.toString().split('').reverse();

						wallet.push('Copper: ' + number[1] + number[0]);
						wallet.push('Silver: ' + number[3] + number[2]);
						wallet.push('Gold: ' + number.slice(4).reverse().join(''));
					} else {
						wallet.push(currency.name + ': ' + userCurrency.value);
					}
				}
			}
		}

		return message.say(wallet);
	}
};