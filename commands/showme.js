module.exports = {
	name: 'showme',
	usable: true,
	execute(message) {
		console.log(message.client.logChannels);
		console.log(message.client.logChannels[message.guild.id]);
		// console.log(message.client.logChannels.get(message.guild.id).channel);
		console.log(message.client.reports);
	},
};