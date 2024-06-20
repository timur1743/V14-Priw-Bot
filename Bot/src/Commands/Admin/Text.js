const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { BotOwners } = require('../../../config.js');

module.exports = {
    name: "yaz",
    aliases: ["text"],

    execute: async (client, message, args) => {
        if (!BotOwners.some(tk => message.member.user.id == tk)) return message.reply({ content: `Yetkin bulunmuyor.` })
        if (args[0] != "metin" && args[0] != "embed") return message.reply({ content: "Göndermek istediğiniz mesajın türünü seçiniz (metin/embed)" })
        if (args[0] == "metin") {
            if (message) message.delete()
            message.channel.send({ content: `${args.splice(1).join(" ")}` })
        }
        if (args[0] == "embed") {
            if (message) message.delete()
            message.channel.send({ embeds: [ new EmbedBuilder().setDescription(`${args.splice(1).join(" ")}`)] })
        }
    }
}

