module.exports = {
	name: 'serverinfo',
	description: 'Shows server info.',
	aliases: ['serverinf', 'guildinfo', 'guild'],
	execute (message) {
		if (message.channel.type === 'dm') return message.channel.send('You need to be in a server to use this command.')
		message.channel.send('**__Server Information__**\n**Server Name:** ' + message.channel.guild.name + '\n**Server Owner:** ' + message.channel.guild.owner.user.username + '\n**Number of Members:** ' + message.channel.guild.memberCount)
	},
};
