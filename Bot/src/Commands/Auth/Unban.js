const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { BotOwners } = require('../../../config.js');
const system = require('../../../config.js')

module.exports = {
    name: "unban",
    aliases: ["banac", "banaç"],

    execute: async (client, message, args) => {

        if (!message.member.roles.cache.has(system.BanHammer) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            message.react(`❌`);
            return message.reply({ content: `Yetkin bulunmuyor ezik oc?` }).then(x => { setTimeout(() => { x.delete() }, 5000) });
        }

        const member = await getUser(client, args[0])

        if (message.author.id === args[0]) return message.reply({ content: `Kendini niye banlion amk` }).then(x => { setTimeout(() => { x.delete() }, 5000) })
        const bans = await message.guild.bans.fetch();
        if (bans.size === 0) return message.channel.send({ content: `Sunucuda yasaklama yokki.` });
        const bannedMember = bans.find(yasakli => yasakli.user.id == args[0]);
        if (!bannedMember) return message.channel.send({ content: `Bu üye banlı değil!` });
        message.guild.members.unban(args[0]);
        message.reply`Başarıyla ${member} üyesinin sunucudaki yasaklaması kaldırıldı!`
    }
}

async function getUser(client, user) {
    try {
        return await client.users.fetch(user);
    } catch (error) {
        return undefined;
    }
}
