const { botAuthor, botName, botVersion, prefix } = require('../config.json');

module.exports = {
	name: 'info',
	description: 'Shows info about the bot.',
	execute(message) {
		message.channel.send(`**Name:** ${botName}\n**Author:** ${botAuthor}\n**Version:** ${botVersion}\n**Prefix:** ${prefix}`);
	},
};