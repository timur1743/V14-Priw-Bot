const { Client, Partials, GatewayIntentBits, Events, EmbedBuilder, ActivityType, Collection, ApplicationCommandOptionType, Permissions} = require('discord.js');
const client = global.client = new Client({intents: Object.keys(GatewayIntentBits),partials:Object.keys(Partials)});
const system = require('./config.js');
const { readdir } = require('fs');

const commands = client.commands = new Collection();
const aliases = client.aliases = new Collection(); 
 readdir("./src/Commands/", (err, files) => {
     if (err) console.error(err)
     files.forEach(f => {
         readdir("./src/Commands/" + f, (err2, files2) => {
             if (err2) console.log(err2)
             files2.forEach(file => {
                 let tkcum = require(`./src/Commands/${f}/` + file);
                 console.log(`${tkcum.name} Loading!`);
                 commands.set(tkcum.name, tkcum);
                 tkcum.aliases.forEach(alias => { aliases.set(alias, tkcum.name); });
             });
         }); 
     });
 });

readdir("./src/Events/", (err, files) => {
    if (err) console.error(err)
    files.forEach(f => {
        require(`./src/Events/${f}`);
        console.log(`[EVENT] (${f.replace(".js", "")})`) 
    });
});

 client.on(Events.MessageCreate, async (message) => {
    if (message.content == "<@136619876407050240>") return message.reply({ content: `timuru etiketleme amk` })
    if (system.Prefix && !message.content.startsWith(system.Prefix)) return;
    if (message.content.includes(".patlat")) return message.reply({ content: `omgg sunucu patladi xd?` })
    const args = message.content.slice(1).trim().split(/ +/g);
    const commands = args.shift().toLowerCase();
    const cmd = client.commands.get(commands) || [...client.commands.values()].find((e) => e.aliases && e.aliases.includes(commands));
    if (cmd) {
        cmd.execute(client, message, args);
    }
})



client.on(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}`);
  setInterval(() => client.user.setActivity({ name: `${system.BotStatus}`,
      type: ActivityType.Streaming,
      url: "https://www.twitch.tv/amouranth"}), 10000);

      setInterval(async () => {
        const voice = require('@discordjs/voice');
        const channel = client.channels.cache.get(system.BotVoiceChannel);
        voice.joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfMute: true,
            selfDeaf: true,
        });

    }, 1000 * 3);

});

const mongoose = require("mongoose");
mongoose.connect(system.MongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
console.log("MongoDB connected!")
}).catch((err) => {
    throw err;
});


client.on(Events.PresenceUpdate, async (oldPresence, newPresence) => {
    let oldActivity = oldPresence?.activities?.find(activity => activity.type === ActivityType.Custom);
    let newActivity = newPresence?.activities?.find(activity => activity.type === ActivityType.Custom);

    if ((oldActivity?.state === newActivity?.state) || (!oldActivity && !newActivity)) return;

    console.log(oldActivity, newActivity);

    const GUILD_ID = system.ServerID;
    const ROLE_ID = system.durumrol;
    const logChannelID = system.durumrollog;
    const logChannel = client.channels.cache.get(logChannelID);

    const guild = client.guilds.cache.get(GUILD_ID);
    const role = guild.roles.cache.get(ROLE_ID);

    if (!guild || !role) return;

    const member = guild.members.cache.get(newPresence?.member.user.id);

    if (!member) return;

    if (!oldActivity?.state.includes(system.urltag) && newActivity?.state.includes(system.urltag)) {
        await member.roles.add(role);

        const embed = new EmbedBuilder()
            .setDescription(`${member} kullanıcısına ${role.name} rolü verildi.`)
            .setFooter({ text: 'tk 🖤' })
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    } else if (oldActivity?.state.includes(system.urltag) && !newActivity?.state.includes(system.urltag)) {
        await member.roles.remove(role);

        const embed = new EmbedBuilder()
            .setDescription(`1${member} kullanıcısından ${role.name} rolü geri alındı.`)
            .setFooter({ text: 'tk 🖤' })
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;
  
    const args = message.content.trim().split(/ +/)
  ;
    const command = args.shift().toLowerCase();
  
    if (command === '.url') {
      if (!message.guild.vanityURLCode) return message.reply("Sunucuda bir özel URL yok.");
  
      const url = await message.guild.fetchVanityData();
      message.reply(`discord.gg/${message.guild.vanityURLCode}\n\`Toplam kullanım:\` **${url.uses}**`);
    }
  });

client.login(system.BotToken);