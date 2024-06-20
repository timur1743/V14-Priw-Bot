const client = global.client;
const { Events, EmbedBuilder } = require("discord.js");
const system = require("../../config.js");
const Servers = require("../Models/Command.js")

client.on(Events.MessageCreate, async (message) => {
    const special = await Servers.findOne({ serverID: message.guild.id });
    const data = special ? special.perms : [];
    let args = message.content.toLocaleLowerCase().substring(system.Prefix.some(x => x.length)).split(" ");
   
    if (Perm) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
        if (Array.isArray(Perm.permRoles) ? !Perm.permRoles.some(app => message.member.roles.cache.has(app)) : !message.member.roles.cache.has(Perm.permRoles) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !message.member.permissions.has(PermissionsBitField.Flags.ManageRoles) && !message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.reply({ content: `Bu komutu kullanmak için yetkiniz bulunmamaktadır.` })
        if (!member) return message.reply({ content: `Lütfen bir kullanıcı belirtin.` })
        if (Array.isArray(Perm.permRoles2) ? Perm.permRoles2.some(app => member.roles.cache.has(app)) : member.roles.cache.has(Perm.permRoles2)) {
            let removedRoles = member.roles.cache.filter(x => Array.isArray(Perm.permRoles2) ? Perm.permRoles2.some(y => x.id === y) : Perm.permRoles2 == x.id).map(x => x.id)
            member.roles.remove(removedRoles)
            message.channel.send({ embeds: [ new EmbedBuilder().setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true }) }).setDescription(`${member} kullanıcısından ${Array.isArray(Perm.permRoles2) ? Perm.permRoles2.map(x => `<@&${x}>`) : `<@&${Perm.permRoles2}>`} ${Array.isArray(Perm.permRoles2) ? `${Perm.permRoles2.length > 1 ? "rolleri" : "rolü"}` : `rolü`} alındı.`)] }).then(e => setTimeout(() => e.delete(), 5000))
        } else {
            member.roles.add(Perm.permRoles2)
            message.channel.send({ embeds: [ new EmbedBuilder().setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true }) }).setDescription(`${member} kullanıcısına ${Array.isArray(Perm.permRoles2) ? Perm.permRoles2.map(x => `<@&${x}>`) : `<@&${Perm.permRoles2}>`} ${Array.isArray(Perm.permRoles2) ? `${Perm.permRoles2.length > 1 ? "rolleri" : "rolü"}` : `rolü`} verildi.`)] }).then(e => setTimeout(() => e.delete(), 5000))
        }
    }
});