const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { BotOwners } = require('../../../config.js');

module.exports = {
    name: "özeloda",
    aliases: ["ozeloda", "secretroom"],

    execute: async (client, message, args) => {
        if (!BotOwners.some(tk => message.member.user.id == tk)) return message.reply({ content: `Yetkin bulunmuyor.` })
        message.channel.send({
            content: `
Merhaba! Özel Oda Sistemine Hoş Geldiniz!

Bu alanda kendi adınıza özel bir oda oluşturabilir ve bu odada istediğiniz konuları tartışabilirsiniz. Yalnızca davet ettiğiniz kişilerin katılmasını sağlayarak özel bir ortam yaratabilir veya herkese açık hale getirerek geniş bir katılımcı kitlesiyle iletişim kurabilirsiniz.

Gizliliği ön planda tutmak istiyorsanız, odanızı kitleyebilir ve sadece belirlediğiniz kişilere erişim izni verebilirsiniz. Alternatif olarak, herkesin rahatlıkla katılabilmesi için odanızı herkese açık yapabilir ve geniş bir kitleyle etkileşime geçebilirsiniz.

Aşağıdaki **"Özel Oda Oluştur"** düğmesine tıklayarak kendi odanızı anında oluşturabilirsiniz. İyi sohbetler dileriz!

Not: [\` Sesli kanalın sohbet kısmından kanalına özel ayarlar paneline erişebilirsin. \`]
`, components: [row]
        });
    }
}