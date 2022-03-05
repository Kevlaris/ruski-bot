const index = require('../index.js');

module.exports = {
	name: 'pause',
	description: 'Pause current queue',
	options: [],
	async execute(interaction) {
		if (!index.queues) {
			return await interaction.reply({ content: 'Couldn\'t find queues' });
		}
		const queue = await index.queues.get(interaction.guildId);
		if (!queue) {
			return await interaction.reply({ content: 'Couldn\'t find queue in server' });
		}

		// interaction.deferReply();
		try {
			await queue.setPaused(true);
		}
		catch (error) {
			console.error(error);
			return await interaction.reply({ content: 'Couldn\'t pause queue' });
		}
		await interaction.reply({ content: 'Paused queue!' });
	},
};