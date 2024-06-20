const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { footer } = require('../../../config.js');

module.exports = {
    name: "say",
    aliases: [],

    execute: async (client, message, args) => {

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.react(`❌`);

        let OnlineMember = message.guild.members.cache.filter(m => m.presence && m.presence.status !== "offline").size
        let VoiceMember = message.guild.members.cache.filter((x) => x.voice.channel).size
        let tarih = message.createdTimestamp;
        const tarih_ifadesi = `<t:${Math.floor(tarih / 1000)}:f>`;

        const embed = new EmbedBuilder()
        .setDescription(`
           ${tarih_ifadesi} 
        Sesli kanallarda **${VoiceMember}** aktif üye var.
        Sunucuda toplam **${message.guild.memberCount}**  (**${OnlineMember} aktif**) üye var.
        Sunucuda toplam **${message.guild.premiumSubscriptionCount}**  (${message.guild.premiumTier !== 'NONE' ? `\`${message.guild.premiumTier.toString().replace("Tier_1", "1").replace("Tier_2", "2").replace("Tier_3", "3")}. Lvl\`` : ''}) boost var.
        `)
        .setFooter({ text: 'tk', iconURL: 'https://cdn.discordapp.com/emojis/1101244818119741532.webp?size=128&quality=lossless' }) // Footer'ı bir nesne içerisinde belirtin
        .setTimestamp()
    

        message.channel.send({ embeds:  [embed] })
    }
}


