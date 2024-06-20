const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
const { BotOwners } = require('../../../config.js');

module.exports = {
    name: "menü",
    aliases: ["selectmenü", "menu","rolmenu"],

    execute: async (client, message, args) => {
        if (!BotOwners.some(tk => message.member.user.id == tk)) return message.reply({ content: `Yetkin bulunmuyor.` })     
      
        const row2 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('color-roles')
                .addOptions([
                    { label: 'Siyah', value: 'siyah', emoji: { id: '1217564387649388554' } },
                    { label: 'Beyaz', value: 'beyaz', emoji: { id: '1217564357810978897' } },
                    { label: 'Kırmızı', value: 'kırmızı', emoji: { id: '1217564350320083075' } },
                    { label: 'Mavi', value: 'mavi', emoji: { id: '1217564417672351775' } },
                    { label: 'Sarı', value: 'sarı', emoji: { id: '1217564355625746606' } },
                    { label: 'Yeşil', value: 'yeşil', emoji: { id: '1217564391344701532' } },
                    { label: 'Mor', value: 'mor', emoji: { id: '1217564359216337051' } },
                    { label: 'Pembe', value: 'pembe', emoji: { id: '1217564354548072508' } },
                    { label: 'Rol İstemiyorum', value: 'rolistemiom-1', emoji: { id: '1150046811327832095' } },
                ])
        )

        if (message) message.delete().catch(err => { });
        message.channel.send({
        });
    }
}