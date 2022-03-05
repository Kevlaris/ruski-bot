const index = require('../index.js');

module.exports = {
	name: 'resume',
	description: 'Resume current queue',
	options: [],
	async execute(interaction) {
		if (!index.queues) {
			return await interaction.reply({ content: 'Couldn\'t find queues' });
		}
		const queue = await index.queues.get(interaction.guildId);
		if (!queue) {
			return await interaction.reply({ content: 'Couldn\'t find queue in server' });
		}

		interaction.deferReply();
		try {
			await queue.setPaused(false);
			// await queue.play();
		}
		catch (error) {
			console.error(error);
			return await interaction.reply({ content: 'Couldn\'t resume queue' });
		}
		return await interaction.followUp({ content: 'Resumed queue!' });
	},
};