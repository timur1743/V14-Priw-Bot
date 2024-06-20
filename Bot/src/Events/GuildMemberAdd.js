const client = global.client; 
const { Events } = require("discord.js");
const system = require("./../../config.js");

client.on(Events.GuildMemberAdd, async (member) => {
    member.roles.add(system.MemberRole);

    const welcomeChannelId = system.WelcomeChannel;
    const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

    if (welcomeChannel) {
        const welcomeMessage = await welcomeChannel.send(`${member} 🐱‍🏍Sunucumuza hoşgeldin.`);
        
        // 5 saniye sonra mesajı sil
        setTimeout(() => {
            welcomeMessage.delete().catch(console.error);
        }, 5000);

    } else {
        console.error('Belirtilen kanal bulunamadı.');
    }

    member.roles.add(system.MemberRole);
});