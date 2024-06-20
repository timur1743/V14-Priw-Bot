const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { BotOwners } = require('../../../config.js');

const roles = [
    { name: "Siyah", color: "#090909" },
    { name: "Beyaz", color: "#ffffff" },
    { name: "Kırmızı", color: "#ff0000" },
    { name: "Mavi", color: "#000cff" },
    { name: "Sarı", color: "#fde910" },
    { name: "Yeşil", color: "#00ff19" },
    { name: "Mor", color: "#6524fd" },
    { name: "Pembe", color: "#ff00f2" },
]

module.exports = {
    name: "rol-kurulum",
    aliases: ["setup","rolkur"],

    execute: async (client, message, args) => {
        if (!BotOwners.some(tk => message.member.user.id == tk)) return message.reply({ content: `Yetkin bulunmuyor.` });
        const data = roles
        const loadingMessage = await message.reply(`Roller oluşturuluyor...`)
        for (let index = 0; index < data.length; index++) {
            let element = roles[index];
            await message.guild.roles.create({
                name: element.name,
                color: element.color
            })
        }
        loadingMessage.edit({ content: `Menü için gerekli Rollerin kurulumu başarıyla tamamlanmıştır.` })
    }
}

