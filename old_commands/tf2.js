const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'tf2',
	description: 'Get TF2 statistics of a Steam user.',
	usage: '[username]',
	aliases: ['tf2stats'],
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
						const minutesPlayed = tf2.playtime_forever;

						try {
							fetch(tf2statscheck).then(res => res.json()).then(bodyyy => {
								const stats = bodyyy.playerstats.stats;

								let dominations = 0;
								let damageDealt = 0;
								let backstabs = 0;
								let points = 0;
								let kills = 0;
								let healed = 0;

								function killFilter(value) {
									const regex = /.accum.iNumberOfKills$/;
									if (regex.test(value.name)) return kills = kills + value.value;
								}

								function dmgFilter(value) {
									const regex = /.accum.iDamageDealt$/;
									if (regex.test(value.name)) return damageDealt = damageDealt + value.value;
								}

								function bsFilter(value) {
									const regex = /.accum.iBackstabs$/;
									if (regex.test(value.name)) return backstabs = backstabs + value.value;
								}

								function pointFilter(value) {
									const regex = /.accum.iPointsScored$/;
									if (regex.test(value.name)) return points = points + value.value;
								}

								function domFilter(value) {
									const regex = /.accum.iDominations$/;
									if (regex.test(value.name)) return dominations = dominations + value.value;
								}

								function healFilter(value) {
									const regex = /Healed$/;
									if (regex.test(value.name)) return healed = healed + value.value;
								}

								stats.forEach(killFilter);
								stats.forEach(dmgFilter);
								stats.forEach(bsFilter);
								stats.forEach(pointFilter);
								stats.forEach(domFilter);
								stats.forEach(healFilter);

								const embed = new Discord.MessageEmbed()
									.setAuthor(client.user.tag, client.user.avatarURL())
									.setTitle(`TF2 Stats | ${personaname}`)
									.setURL(profileurl)
									.setThumbnail(avatarfull)
									.setDescription(`Total minutes: ${minutesPlayed}`)
									.addFields(
										{ name: 'Total Points:', value: points, inline: false },
										{ name: 'Total Kills', value: kills, inline: true },
										{ name: 'Total Damage Dealt', value: damageDealt, inline: true },
										{ name: 'Total Backstabs', value: backstabs, inline: true },
										{ name: 'Total Dominations', value: dominations, inline: false },
										{ name: 'Total Health Healed', value: healed, inline: true },
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