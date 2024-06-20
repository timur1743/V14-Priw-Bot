const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { BotOwners } = require('../../../config.js');
const system = require('../../../config.js')

module.exports = {
    name: "ban",
    aliases: ["yargı", "sg", "uza", "sikat", "yargi","sik"],

    execute: async (client, message, args) => {

        if (!message.member.roles.cache.has(system.BanHammer) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            message.react(`❌`);
            return message.reply({ content: `Yetkin bulunmuyor ezik oc?` }).then(x => { setTimeout(() => { x.delete() }, 5000) });
        }

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (message.author.id === member.id) return message.reply({ content: `Kendini niye banlion amk` }).then(x => { setTimeout(() => { x.delete() }, 5000) })
        if (!member) return message.reply({ content: `Üye belirt mal?` })
        if (member && !member.bannable) return message.channel.send({ content: "Bu üyeyi banlayamıyorum amk mali" }).then((e) => setTimeout(() => { e.delete(); }, 5000));
        const reason = args.slice(1).join(" ") || "Anasının amını sikeyim";
        if (!reason) return message.reply({ content: `Sebep belirt!` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
        await message.guild.members.ban(member.id, { reason: `${message.author.username} tarafından banlandı. (${reason})` }).catch(err => { })
        message.channel.send({ content: `${member} adlı kullanıcı ${message.author} tarafından **${reason}** adlı sebepten dolayı siktiri yedi.` })
    }
}

