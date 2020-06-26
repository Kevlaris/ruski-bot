const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'tf2hours',
	description: 'Get TF2 hours per class of a Steam user.',
	usage: '[username]',
	execute(message, args, client) {
		let steam_api_key = process.env.steam_api_key;
		if (steam_api_key == null) steam_api_key = require('../data/config_private.json').steam_api_key;

		const url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${steam_api_key}&vanityurl=${args.join(' ')}`;

		try {

			fetch(url).then(res => res.json()).then(body => {
				if (body.response.success === 42) return message.reply('I was unable to find a Steam account with that name.');

				const id = body.response.steamid;
				const summaries = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steam_api_key}&steamids=${id}`;
				const tf2check = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steam_api_key}&steamid=${id}&format=json&include_played_free_games&include_appinfo`;
				const tf2statscheck = `http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=440&key=${steam_api_key}&steamid=${id}`;

				fetch(summaries).then(res => res.json()).then(bodi => {
					if(!bodi.response) return message.reply('there was an error while getting player information.');

					const { personaname, avatarfull, profileurl } = bodi.response.players[0];

					fetch(tf2check).then(res => res.json()).then(bodyy => {
						if (!bodyy.response) return message.reply('I was unable to find a Steam account with that name.');

						const games = bodyy.response.games;

						if (!games) return message.channel.send(`**${personaname}**'s Game Library is Private.`);

						function tfFilter(value) {
							return value.appid = 440;
						}

						const tf2 = games.find(tfFilter);

						if(!tf2) return message.reply(`**${personaname}** doesn't own TF2.`);

						const tf2icon = 'https://pbs.twimg.com/profile_images/1013352784626900992/xYqlaU9y_400x400.jpg';
						let minutesPlayed = tf2.playtime_forever;

						if (minutesPlayed === 0) minutesPlayed = null;

						try {
							fetch(tf2statscheck).then(res => res.json()).then(bodyyy => {
								const stats = bodyyy.playerstats.stats;

								const hours = {};

								hours.scout = 0;
								hours.soldier = 0;
								hours.pyro = 0;
								hours.demo = 0;
								hours.heavy = 0;
								hours.engi = 0;
								hours.medic = 0;
								hours.sniper = 0;
								hours.spy = 0;

								function heavyFilter(value) {
									const regex = /Heavy.accum.iPlayTime$/;
									if (regex.test(value.name)) return hours.heavy = Math.floor(hours.heavy + value.value / 3600);
								}

								function soldierFilter(value) {
									const regex = /Soldier.accum.iPlayTime$/;
									if (regex.test(value.name)) return hours.soldier = Math.floor(hours.soldier + value.value / 3600);
								}

								function pyroFilter(value) {
									const regex = /Pyro.accum.iPlayTime$/;
									if (regex.test(value.name)) return hours.pyro = Math.floor(hours.pyro + value.value / 3600);
								}

								function demoFilter(value) {
									const regex = /Demoman.accum.iPlayTime$/;
									if (regex.test(value.name)) return hours.demo = Math.floor(hours.demo + value.value / 3600);
								}

								function scoutFilter(value) {
									const regex = /Scout.accum.iPlayTime$/;
									if (regex.test(value.name)) return hours.scout = Math.floor(hours.scout + value.value / 3600);
								}

								function engiFilter(value) {
									const regex = /Engineer.accum.iPlayTime$/;
									if (regex.test(value.name)) return hours.engi = Math.floor(hours.engi + value.value / 3600);
								}

								function medicFilter(value) {
									const regex = /Medic.accum.iPlayTime$/;
									if (regex.test(value.name)) return hours.medic = Math.floor(hours.medic + value.value / 3600);
								}

								function sniperFilter(value) {
									const regex = /Sniper.accum.iPlayTime$/;
									if (regex.test(value.name)) return hours.sniper = Math.floor(hours.sniper + value.value / 3600);
								}

								function spyFilter(value) {
									const regex = /Spy.accum.iPlayTime$/;
									if (regex.test(value.name)) return hours.spy = Math.floor(hours.spy + value.value / 3600);
								}

								stats.forEach(heavyFilter);
								stats.forEach(soldierFilter);
								stats.forEach(pyroFilter);
								stats.forEach(demoFilter);
								stats.forEach(scoutFilter);
								stats.forEach(engiFilter);
								stats.forEach(medicFilter);
								stats.forEach(sniperFilter);
								stats.forEach(spyFilter);

								if (minutesPlayed == null) minutesPlayed = 'Unknown';

								const embed = new Discord.MessageEmbed()
									.setAuthor(client.user.tag, client.user.avatarURL())
									.setTitle(`TF2 Stats | ${personaname}`)
									.setURL(profileurl)
									.setThumbnail(avatarfull)
									.setDescription(`Total minutes: ${minutesPlayed}`)
									.addFields(
										{ name: 'Hours as Scout', value: hours.scout, inline: false },
										{ name: 'Hours as Soldier', value: hours.soldier, inline: false },
										{ name: 'Hours as Pyro', value: hours.pyro, inline: false },
										{ name: 'Hours as Demo', value: hours.demo, inline: false },
										{ name: 'Hours as Heavy', value: hours.heavy, inline: false },
										{ name: 'Hours as Engineer', value: hours.engi, inline: false },
										{ name: 'Hours as Medic', value: hours.medic, inline: false },
										{ name: 'Hours as Sniper', value: hours.sniper, inline: false },
										{ name: 'Hours as Spy', value: hours.spy, inline: false },
									)
									.setTimestamp()
									.setFooter('Steam Web API', tf2icon);
								message.channel.send(embed);
							});
						}
						catch (warn) {
							console.warn(warn);
							message.channel.send(`**${personaname}**'s TF2 Stats are Private.`);
						}
					});
				});
			});
		}
		catch (error) {
			console.error(error);
		}
	},
};