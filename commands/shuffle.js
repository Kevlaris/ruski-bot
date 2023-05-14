const index = require('../index.js');

module.exports = {
	name: 'shuffle',
	description: 'Shuffles current queue',
	options: [],
	async execute(interaction) {
		const queue = await index.player.getQueue(interaction.guildId);
		if (!queue) {
			return await interaction.reply({ content: 'Couldn\'t find queue in server' });
		}

		try {
			await queue.shuffle();
		}
		catch (error) {
			console.error(error);
			return await interaction.reply({ content: 'Couldn\'t shuffle queue' });
		}
		return await interaction.reply({ content: 'Shuffled queue!' });
	},
};