const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, RoleSelectMenuBuilder, StringSelectMenuBuilder } = require('discord.js');
const { BotOwners } = require('../../../config.js');
const Servers = require('../../Models/Command');

module.exports = {
    name: "özelkomut",
    aliases: ["ozelkomut"],

    execute: async (client, message, args) => {

        if (!['ekle', 'çıkar', 'liste'].some(x=> args[0] == x)) return message.reply({ content: `Lütfen geçerli bir işlem belirtin. \`ekle\`, \`çıkar\`, \`liste\` `})

        if (args[0] === 'ekle') {
            const special = await Servers.findOne({ serverID: message.guild.id });
            const data = special ? special.perms : [];
            let msg = await message.channel.send({ content: `Eklemek istediğin komutun adını yazman yeterlidir. (İşlem 15 saniye sonra iptal edilecektir.)` })
            let push = {}
            const filter = i => i.author.id == message.member.id
            await message.channel.awaitMessages({ filter: filter, max: 1, time: 15000, errors: ["time"] })
                .then(async isim => {
                    if (isim.first().content == ("iptal" || "i")) {
                        isim.first().delete();
                        msg.delete();
                        return;
                    };
                    if (isim.first().content.includes(" ")) {
                        msg.delete();
                        isim.first().content;
                        return message.channel.send({ content: `Komut ismi boşluk içeremez.` });
                    }
                    if (data.some(veri => veri == (isim.first().content))) return message.reply({ content: `Bu komut daha önce zaten eklenmiş` })
                    if (isim.first().content.length > 20) return message.channel.send({ content: `Komut ismi 20 karakterden uzun olamaz.` });
                    push.permName = isim.first().content
                    isim.first().delete();
                    await msg.edit({ content: 'Komutu kullanma izni verilcek rolleri aşağıda ki menüden seçiniz.', components: [ new ActionRowBuilder().setComponents(new RoleSelectMenuBuilder().setCustomId("permRoleSelectMenu").setMaxValues(5))] });
                })

            const filter2 = i => i.user.id == message.member.id
            const collector = msg.createMessageComponentCollector({ filter: filter2, errors: ["time"], time: 35000 })
            collector.on("collect", async i => {
                await i.deferUpdate()
                if (i.customId == "permRoleSelectMenu") {

                    var role = []
                    for (let index = 0; index < i.values.length; index++) {
                        let ids = i.values[index]
                        role.push(ids)
                    }

                    push.permRoles = role

                    let msg2 = await message.channel.send({ content: `Verilecek rolü seçiniz.`, components: [ new ActionRowBuilder().setComponents(new RoleSelectMenuBuilder().setCustomId("permRolesSelectMenu").setMaxValues(5))] })
                    const filter3 = i => i.user.id == message.member.id
                    const collector2 = msg2.createMessageComponentCollector({ filter: filter3, errors: ["time"], time: 35000 })

                    collector2.on("collect", async i => {
                        await i.deferUpdate()
                        if (i.customId == "permRolesSelectMenu") {

                            var role2 = []
                            for (let index = 0; index < i.values.length; index++) {
                                let ids = i.values[index]
                                role2.push(ids)
                            }

                            push.permRoles2 = role2
                            msg2.delete()
                            msg.delete()
                            await Servers.findOneAndUpdate({ serverID: message.guild.id }, { $push: { perms: push } }, { upsert: true })
                            return message.channel.send({ content: `Komut başarıyla eklendi.` })
                        }
                    })

                }
            })
        }

        if (args[0] === 'liste') {
            const special = await Servers.findOne({ serverID: message.guild.id });
            const data = special ? special.perms : [];
            if (data.length < 1) return message.channel.send({ content: `Bu sunucuda hiç özel komut bulunmuyor.` })
            let msg = await message.channel.send({ content: `Veriler çekiliyor lütfen bekleyiniz...` })
            let array = []
            data.forEach((data) => {
                array.push(`Komut Adı: ${data.permName}\n Y. Rolü: ${data.permRoles.map(x => `<@&${x}>`).join(", ")}\n Rol: ${data.permRoles2.map(x => `<@&${x}>`).join(", ")}\n------------------`)
            })
            msg.edit({ content: `Sunucuda bulunan özel komutlar aşağıda listelenmiştir.` , embeds: [ new EmbedBuilder().setDescription(`${array.join("\n")}`)] })
        }

        if (args[0] === 'çıkar' || args[0] === 'cıkar' || args[0] === 'cikar' ) {
            const special = await Servers.findOne({ serverID: message.guild.id });
            const data = special ? special.perms : [];
            if (data.length < 1) return message.channel.send({ content: `Bu sunucuda hiç özel komut bulunmuyor.` })
            const options = data.map(perm => ({ label: perm.permName, value: perm.permName }));
            const Row = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("selectPerm")
                    .setPlaceholder("Silmek istediğiniz komutu seçin.")
                    .setOptions(options)
            )

            let msg = await message.channel.send({ content: `Silmek istediğiniz komutu aşağıdaki menüden seçebilirsiniz!`, components: [Row] })
            const filter = i => i.user.id == message.member.id
            const collector = msg.createMessageComponentCollector({ filter: filter, errors: ["time"], time: 35000 })

            collector.on("collect", async i => {
                await i.deferUpdate()
                if (i.customId == "selectPerm") {
                    let type = i.values
                    if (!type) return await i.reply({ content: "Bir komut veya işlem bulunamadı!", ephemeral: true })

                    let deletedCommand = data.find(perm => perm.permName == type)
                    if (!deletedCommand) return await i.reply({ content: "Bir komut veya işlem bulunamadı!", ephemeral: true })
                    await Servers.findOneAndUpdate({ serverID: message.guild.id }, { $pull: { perms: deletedCommand } }, { upsert: true })
                    if (msg) msg.delete().catch(() => { })
                    return message.channel.send({ content: `Komut başarıyla silindi.` })
                }
            })
        }
    }
}