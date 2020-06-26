const Discord = require('discord.js');
const fetch = require('node-fetch');
const dateFormat = require('dateformat');

module.exports = {
	name: 'steam',
	description: 'Get statistics of a Steam user.',
	usage: '[username]',
	async execute(message, args, client) {
		let steam_api_key = process.env.steam_api_key;
		if (steam_api_key == null) steam_api_key = require('../data/config_private.json').steam_api_key;

		if(!args[0]) return message.reply('you didn\' specify an account name.');

		const url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${steam_api_key}&vanityurl=${args.join(' ')}`;

		try {

			fetch(url).then(res => res.json()).then(body => {
				if (body.response.success === 42) return message.reply('I was unable to find a Steam account with that name.');
				console.log('url');

				const id = body.response.steamid;
				const summaries = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steam_api_key}&steamids=${id}`;
				const bans = `http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${steam_api_key}&steamids=${id}`;
				const status = ['Offline', 'Online', 'Busy', 'Away', 'Snooze', 'Looking to Trade', 'Looking to Play'];

				fetch(summaries).then(res => res.json()).then(body => {
					if (!body.response) return message.reply('I was unable to find a Steam account with that name.');
					console.log('summaries');

					const { personaname, avatarfull, realname, personastate, loccountrycode, profileurl, timecreated } = body.response.players[0];

					fetch(bans).then(res => res.json()).then(body => {
						if (!body.players) return message.reply('I was unable to find a Steam account with that name.');
						console.log('bans');

						const { NumberOfVACBans, NumberOfGameBans } = body.players[0];

						const embed = new Discord.MessageEmbed()
							.setAuthor(client.user.tag, client.user.avatarURL())
							.setThumbnail(avatarfull)
							.setTitle(`Steam Account | ${personaname}`)
							.addFields(
								{ name: 'Real Name', value: realname || 'Unknown', inline: true },
								{ name: 'Status', value: status[personastate], inline: true },
								{ name: 'Country', value: `:flag_${loccountrycode ? loccountrycode.toLowerCase() : 'white'}:`, inline: true },
								{ name: 'Account Created At', value: dateFormat(timecreated * 1000, 'yyyy/hh/dd, HH:MM:ss'), inline: true },
								{ name: 'VAC Bans', value: NumberOfVACBans, inline: false },
								{ name: 'Game Bans', value: NumberOfGameBans, inline: true },
							)
							.setTimestamp()
							.setURL(profileurl)
							.setFooter('Steam Web API');
						message.channel.send(embed);
					});
				});
			});
		}
		catch (error) {
			console.error(error);
		}
	},
};