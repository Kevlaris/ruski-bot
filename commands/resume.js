const index = require('../index.js');

module.exports = {
	name: 'resume',
	description: 'Resume current queue',
	options: [],
	async execute(interaction) {
		const queue = await index.player.getQueue(interaction.guildId);
		if (!queue) {
			return await interaction.reply({ content: 'Couldn\'t find queue in server' });
		}

		try {
			await queue.setPaused(false);
		}
		catch (error) {
			console.error(error);
			return await interaction.reply({ content: 'Couldn\'t resume queue' });
		}
		return await interaction.reply({ content: 'Resumed queue!' });
	},
};