const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { BotOwners } = require('../../../config.js');
const { VipRole } = require('../../../config.js');

module.exports = {
    name: "vip",
    aliases: [],
    execute: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.react(`❌`);
    
    
    }}