const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    name: "avatar",
    aliases: ["av", "avata"],

    execute: async (client, message, args) => {

        const member = args.length > 0 ? message.mentions.users.first() || await client.users.fetch(args[0]) || message.author : message.author
        let Link = new ActionRowBuilder({ components: [new ButtonBuilder({ label: "Tarayıcıda Aç", style: ButtonStyle.Link, url: member.displayAvatarURL({ dynamic: true }) })] })
        message.channel.send({
            content: member.displayAvatarURL({ dynamic: true }),
            components: [Link]
        })
    }
}