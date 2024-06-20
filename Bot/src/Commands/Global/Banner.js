const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: "banner",
    aliases: [],

    execute: async (client, message, args) => {

        const member = args.length > 0 ? message.mentions.users.first() || await client.users.fetch(args[0]) || message.author : message.author
        let banner = await tkBanner(member.id, client)
        if (!banner) return message.reply({ content: `Kullanıcının banneri bulunmuyor. ` })
        if (banner) {
            let Link = new ActionRowBuilder({ components: [new ButtonBuilder({ label: "Tarayıcıda Aç", style: ButtonStyle.Link, url: `${banner}` })] })
            message.channel.send({
                content: `${banner}`, 
                components: [Link]
            })
        }
    }
}

async function tkBanner(user, client) {
    const response = await axios.get(`https://discord.com/api/v9/users/${user}`, { headers: { 'Authorization': `Bot ${client.token}` } });
    if (!response.data.banner) return
    if (response.data.banner.startsWith('a_')) return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.gif?size=512`
    else return (`https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.png?size=512`)
}