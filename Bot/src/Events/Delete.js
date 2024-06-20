const client = global.client; 
const { AuditLogEvent, Events } = require("discord.js");
const SecretRoom = require("../Models/SecretRoom");

client.on(Events.ChannelDelete, async (channel) => {
    const ChannelLog = await channel.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelDelete });
        const Entry = ChannelLog.entries.first();
        const User = Entry.executor;
        if (!User || User.bot) return;
        const secretRoom = await SecretRoom.findOne({ id: channel.id });
        if (!secretRoom) return;
        await SecretRoom.deleteMany({ id: channel.id });
});