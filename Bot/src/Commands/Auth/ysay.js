const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { BotOwners, ysayrol } = require('../../../config.js');

module.exports = {
    name: "ysay",
    aliases: ["sessay", "yetkilisay",],

    execute: async (client, message, args, config) => {
        if (!message.member.roles.cache.has(BotOwners) && !BotOwners.some(e => message.member.roles.cache.has()) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.react('❌');

        let sesdeolmayanlar = message.guild.members.cache.filter(y => {
            return y.roles.cache.has("1253314044581122119") && !y.voice.channel
        });

        let sesdeolmayanlar2 = message.guild.members.cache.filter(y => {
            return y.roles.cache.has("1253314159966421144") && !y.voice.channel
        });

        message.channel.send({ content: `\`\`\Seste Olmayan Ibneler. (${sesdeolmayanlar.size},${sesdeolmayanlar2.size})\`\`\ \n${sesdeolmayanlar.map(y => `\n${y}`).join('')} ${sesdeolmayanlar2.map(y => `\n${y}`).join('')}` })  
    }
}