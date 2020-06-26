const Discord = require('discord.js');
const { client } = require('../index.js');

module.exports = {
	name: 'announce',
	description: 'Announce something in a specified channel.',
	usage: '[channel] [announcement]',
	async execute(message, args) {
		const channel_raw = args[0];
		const announcement = args.splice(1).join(' ');

		if (!channel_raw || !announcement) return message.reply('you didn\'t specify an announcement, and/or a channel!');

		const channel_id = channel_raw.substring(2, channel_raw.length - 1);

		const channel = await message.guild.channels.cache.get(channel_id);

		if (!channel) return message.reply('I couldn\'t find the specified channel.');

		if (!message.member.hasPermission('MANAGE_SERVER' || 'ADMINISTRATOR')) return message.reply('you don\'t have the proper permissions to announce something!');

		const data = [];

		const filter = /@everyone/;

		if (filter.test(announcement)) data.push('@everyone');

		const embed = new Discord.MessageEmbed()
			.setAuthor(client.user.tag, client.user.avatarURL())
			.setTitle('Announcement')
			.setDescription(announcement)
			.setFooter(`Announced by ${message.author.tag}`, message.author.avatarURL());
		data.push(embed);

		try {
			channel.send(data, { split: true });
			return message.channel.send('**Announcement sent!**');
		}
		catch (error) {
			message.reply('there was an error while sending announcement.');
			return console.error(error);
		}
	},
};