const client = global.client; 
const { Events } = require("discord.js");
const SecretRoom = require("../Models/SecretRoom");

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    if (oldState.member && oldState.member.user.bot || newState.member && newState.member.user.bot) return;
    if (oldState.channel && !newState.channel) {
        const secretroom = await SecretRoom.findOne({ id: oldState.channelId });
        if (!secretroom) return;
        const channel = await client.channels.fetch(secretroom.id);
        if (channel.members.size === 0) {
            await SecretRoom.deleteMany({ id: secretroom.id });
        }
    }
});