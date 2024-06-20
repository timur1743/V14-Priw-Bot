const client = global.client;
const { ActionRowBuilder, PermissionsBitField, Events, EmbedBuilder, ChannelType, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, AttachmentBuilder, PermissionFlagsBits, ModalBuilder, UserSelectMenuBuilder, StringSelectMenuBuilder } = require("discord.js");
const SecretRoom = require("../Models/SecretRoom");
const system = require("./../../config.js")

client.on(Events.InteractionCreate, async (interaction) => {
  const secretRoom = await SecretRoom.findOne({ id: interaction.channel.id });
  if (interaction.customId === 'secretroom') {
    const secretRoom = await SecretRoom.findOne({ ownerId: interaction.user.id });
    if (secretRoom) return interaction.reply({ content: 'Zaten bir kanalınız bulunmakta. Eğer bunun bir hata olduğunu düşünüyorsanız kurucularla iletişime geçin.', ephemeral: true });

    const createRoom = new ModalBuilder()
      .setTitle('Özel Oda Oluştur')
      .setCustomId('createRoomm')
      .setComponents(
        new ActionRowBuilder().setComponents(new TextInputBuilder().setCustomId("channelName").setLabel("Oda ismini giriniz.").setStyle(TextInputStyle.Short)),
        new ActionRowBuilder().setComponents(new TextInputBuilder().setCustomId("channelLimit").setLabel("Limiti giriniz.").setStyle(TextInputStyle.Short)),
      );

    interaction.showModal(createRoom)
  }

  if (interaction.customId === 'unlock') {
    if (secretRoom.ownerId !== interaction.user.id) return interaction.reply({ content: 'Bu kanal size ait olmadığı için bu işlemi yapamazsınız.', ephemeral: true });
    var lockChannel = interaction.guild.channels.cache.get(secretRoom.id)
    await lockChannel.permissionOverwrites.create(interaction.guild.roles.everyone, { 1048576: true })
    interaction.reply({ content: `Kanalınız başarıyla kilidi açıldı.`, ephemeral: true })
  }

  if (interaction.customId === 'invisible') {
    if (secretRoom.ownerId !== interaction.user.id) return interaction.reply({ content: 'Bu kanal size ait olmadığı için bu işlemi yapamazsınız.', ephemeral: true });
    var lockChannel = interaction.guild.channels.cache.get(secretRoom.id)
    await lockChannel.permissionOverwrites.create(interaction.guild.roles.everyone, { 1024: false })
    interaction.reply({ content: `Kanalınız başarıyla görünmez yapıldı.`, ephemeral: true })
  }

  if (interaction.customId === 'visible') {
    if (secretRoom.ownerId !== interaction.user.id) return interaction.reply({ content: 'Bu kanal size ait olmadığı için bu işlemi yapamazsınız.', ephemeral: true });
    var lockChannel = interaction.guild.channels.cache.get(secretRoom.id)
    await lockChannel.permissionOverwrites.create(interaction.guild.roles.everyone, { 1024: true })
    interaction.reply({ content: `Kanalınız başarıyla görünür yapıldı.`, ephemeral: true })
  }

  if (interaction.customId === 'removeuser') {
    if (secretRoom.ownerId !== interaction.user.id) return interaction.reply({ content: 'Bu kanal size ait olmadığı için bu işlemi yapamazsınız.', ephemeral: true });
    var lockChannel = interaction.guild.channels.cache.get(secretRoom.id)
    let interactionOptions = lockChannel.permissionOverwrites.cache
      .filter(x => interaction.guild.members.cache.get(x.id) && x.id !== secretRoom.ownerId)
      .map(x => ({
        label: interaction.guild.members.cache.get(x.id).user.username,
        description: "Kullanıcıyı kanaldan çıkarmak için tıkla.",
        value: x.id,
        emoji: { id: "1089511613352120320" }
      }));

    const interactionOptionsArray = [...interactionOptions];

    if (interactionOptions.length < 1) return interaction.reply({ content: 'Kanalınızda hiç üye bulunmuyor.', ephemeral: true });

    interaction.reply({ content: `Çıkaracağınız kullanıcıyı menüden seçin.`, components: [new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('RemoveUser').setPlaceholder('Kullanıcı ara.').setOptions(interactionOptionsArray.slice(0, 25)))], ephemeral: true })
  }

  if (interaction.customId === 'giveowner') {
    if (secretRoom.ownerId !== interaction.user.id) return interaction.reply({ content: 'Bu kanal size ait olmadığı için bu işlemi yapamazsınız.', ephemeral: true });
    var lockChannel = interaction.guild.channels.cache.get(secretRoom.id)
    interaction.reply({ content: `Sahipliği vermek istediğiniz kullanıcıyı menüden seçin.`, components: [new ActionRowBuilder().addComponents(new UserSelectMenuBuilder().setCustomId('GiveOwner').setPlaceholder('Kullanıcı ara.').setMinValues(1).setMaxValues(1))], ephemeral: true })
  }

  if (interaction.customId === 'edit') {
    if (secretRoom.ownerId !== interaction.user.id) return interaction.reply({ content: 'Bu kanal size ait olmadığı için bu işlemi yapamazsınız.', ephemeral: true });
    var lockChannel = interaction.guild.channels.cache.get(secretRoom.id)

    let modal = new ModalBuilder()
      .setTitle('Kanalı Düzenle')
      .setCustomId('editchannel')
      .setComponents(
        new ActionRowBuilder().setComponents(new TextInputBuilder().setCustomId("ChannelName").setLabel("Yeni oda ismini giriniz.").setPlaceholder(`${lockChannel.name}`).setStyle(TextInputStyle.Short).setRequired(true)),
        new ActionRowBuilder().setComponents(new TextInputBuilder().setCustomId("ChannelLimit").setLabel("Yeni limiti giriniz.").setPlaceholder(`${lockChannel.userLimit}`).setStyle(TextInputStyle.Short).setRequired(true)),
      );

    interaction.showModal(modal)
  }

  if (interaction.customId === 'requestowner') {
    const secretRoom = await SecretRoom.findOne({ id: interaction.channel.id });
    if (secretRoom.ownerId === interaction.user.id) return interaction.reply({ content: 'Zaten kanalın sahibisin.', ephemeral: true });
    interaction.deferUpdate({ ephemeral: true })
    var lockChannel = interaction.guild.channels.cache.get(secretRoom.id)

    let msg = await interaction.channel.send({ content: `Hey! <@${secretRoom.ownerId}>, ${interaction.user} kanalın sahipliğini almak istiyor. Kabul ediyor musunuz?`, components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('accept').setLabel('Kabul Et').setStyle(ButtonStyle.Success), new ButtonBuilder().setCustomId('decline').setLabel('Reddet').setStyle(ButtonStyle.Danger))] })
    var filter = (b) => b.user.id === secretRoom.ownerId;
    var collector = msg.createMessageComponentCollector({ filter, time: 60000 });
    collector.on('collect', async (b) => {
      await b.deferUpdate();
      if (b.customId == 'accept') {
        await SecretRoom.updateOne({ id: interaction.channel.id }, { $set: { ownerId: interaction.user.id } }, { upsert: true });
        if (msg) msg.delete().catch(err => { });
        msg.channel.send({ content: `Kanalın sahipliği başarıyla <@${interaction.user.id}> kullanıcısına verildi.` })
      }
      if (b.customId == 'decline') {
        if (msg) msg.delete().catch(err => { });
        msg.channel.send({ content: `Kanalın sahibi isteği reddettiği için kanalın sahipliği <@${interaction.user.id}> kullanıcısına verilemedi.` })
      }
    })
  }

  if (interaction.customId === 'deletechannel') {
    if (secretRoom.ownerId !== interaction.user.id) return interaction.reply({ content: 'Bu kanal size ait olmadığı için bu işlemi yapamazsınız.', ephemeral: true });
    var lockChannel = interaction.guild.channels.cache.get(secretRoom.id)
    lockChannel.delete()
    await SecretRoom.deleteMany({ ownerId: interaction.user.id });
  }

  if (interaction.customId === 'AddUser') {

    if (!secretRoom) return await interaction.reply({ content: 'Bu kanal size ait olmadığı için bu işlemi yapamazsınız.', ephemeral: true })
    let channel = interaction.guild.channels.cache.get(secretRoom.id)
    const selectedUsers = interaction.values;

    const selectedUserNames = selectedUsers.map(userId => {
      const user = interaction.guild.members.cache.get(userId)?.user;
      return user ? user.username : 'Bilinmeyen Kullanıcı';
    });

    selectedUsers.forEach(async x => {
      const user = interaction.guild.members.cache.get(x)?.user;
      await channel.permissionOverwrites.create(user, { ViewChannel: true, Connect: true })
    });

    const replyMessage = `Aşağıda ki kullanıcıların kanala girişlerine izin verildi!\n\`${selectedUserNames.join('\n')}\``;
    interaction.reply({ content: replyMessage, components: [], ephemeral: true });
  }

  if (interaction.customId === 'RemoveUser') {

    if (!secretRoom) return await interaction.reply({ content: 'Bu kanal size ait olmadığı için bu işlemi yapamazsınız.', ephemeral: true })
    let channel = interaction.guild.channels.cache.get(secretRoom.id)
    const selectedUsers = interaction.values;

    const selectedUserNames = selectedUsers.map(userId => {
      const user = interaction.guild.members.cache.get(userId)?.user;
      return user ? user.username : 'Bilinmeyen Kullanıcı';
    })

    selectedUsers.forEach(async userId => {
      const member = interaction.guild.members.cache.get(userId);

      if (member?.voice.channel) {
        await member.voice.disconnect();
      }

      await channel.permissionOverwrites.delete(userId);
    });

    const replyMessage = `Aşağıda ki kullanıcının kanala giriş izni başarıyla kaldırıldı!\n\`${selectedUserNames.join('\n')}\``;
    interaction.reply({ content: replyMessage, components: [], ephemeral: true })
  }

  if (interaction.customId === 'GiveOwner') {

    if (!secretRoom) return await interaction.reply({ content: 'Bu kanal size ait olmadığı için bu işlemi yapamazsınız.', ephemeral: true })
    let channel = interaction.guild.channels.cache.get(secretRoom.id)
    const selectedUser = interaction.values;

    const selectedUserName = selectedUser.map(userId => {
      const user = interaction.guild.members.cache.get(userId)?.user;
      return user ? user.id : 'Bilinmeyen Kullanıcı';
    })

    selectedUser.forEach(async x => {
      const user = interaction.guild.members.cache.get(x)?.user;
      await SecretRoom.updateOne({ id: secretRoom.id }, { $set: { ownerId: user.id } })
    });

    interaction.reply({ content: `<@${selectedUserName}> kullanıcısına oda sahipliği verildi.`, components: [], ephemeral: true })
  }

  if (interaction.customId === 'createRoomm') {
    const RoomName = interaction.fields.getTextInputValue("channelName");
    const RoomLimit = interaction.fields.getTextInputValue("channelLimit");
    if (isNaN(RoomLimit)) return;

    await interaction.guild.channels.create({
      name: RoomName,
      type: ChannelType.GuildVoice,
      userLimit: RoomLimit > 99 ? 99 : RoomLimit,
      parent: system.SecretRoomCategory,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.Connect],
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect],
        },
      ],
    }).then(async (channel) => {
      new SecretRoom({
        id: channel.id,
        ownerId: interaction.user.id,
      }).save();

      const invite = await channel.createInvite({});

      interaction.reply({ content: `**${channel.name}** isimli kanalın oluşturuldu. [Davet Linki](${invite.url})`, ephemeral: true });
      channel.send({
        content: `${interaction.user}`,
        embeds: [
          new EmbedBuilder()
            .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setImage('https://i.hizliresim.com/c5lti6d.png')
        ],
        components: [
          new ActionRowBuilder()
            .setComponents(
              new ButtonBuilder().setCustomId("lock").setEmoji("1195645121107083326").setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId("unlock").setEmoji("1195645253311537184").setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId("invisible").setEmoji("1195645207283253248").setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId("visible").setEmoji("1195645212412870756").setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId("giveowner").setEmoji("1195645255157030924").setStyle(ButtonStyle.Secondary),
            ),
          new ActionRowBuilder()
            .setComponents(
              new ButtonBuilder().setCustomId("adduser").setEmoji("1195645261175865385").setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId("removeuser").setEmoji("1195645259745607720").setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId("edit").setEmoji("1195645257950437466").setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId("requestowner").setEmoji("1195645209149710469").setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId("deletechannel").setEmoji("1195645210609324073").setStyle(ButtonStyle.Secondary),
            ),
        ],
      })
    });
  }

  if (interaction.customId === 'editchannel') {
    const secretRoom = await SecretRoom.findOne({ ownerId: interaction.user.id });
    const channel = await interaction.guild.channels.cache.get(secretRoom.id);
    const channelName = interaction.fields.getTextInputValue("ChannelName");
    const channelLimit = interaction.fields.getTextInputValue("ChannelLimit");

    await channel.edit({
      name: channelName,
      userLimit: channelLimit > 99 ? 99 : channelLimit,
    });

    interaction.reply({ content: `Kanalınız başarıyla güncellendi.`, ephemeral: true });
  }

  if (interaction.customId === "color-roles") {
    const renkRoles = [
      'Gri',
      'Siyah',
      'Beyaz',
      'Kırmızı',
      'Mavi',
      'Sarı',
      'Yeşil',
      'Mor',
      'Turuncu',
      'Pembe',
      'Kahverengi'
    ];

    const foundRoles = interaction.guild.roles.cache.filter(role => renkRoles.includes(role.name));
    const removeRoles = interaction.member.roles.cache.filter(x => renkRoles.includes(x.name)) || [];

    const values = interaction.values;

    if (values[0].includes("rolistemiom")) {
      if (removeRoles.map(x => `${x.name}`).length == 0) return interaction.reply({ content: `Üzerinde zaten rol bulunmuyor.`, ephemeral: true })
      removeRoles.forEach(x => {
        interaction.member.roles.remove(x);
      });
      return interaction.reply({ content: `${removeRoles.map(x => `${x}`)} rolü başarıyla silindi!`, ephemeral: true });
    }

    const addedRoles = [];
    for (i = 0; i < values.length; i++) {
      if (foundRoles.find(r => r.name.toLowerCase() === values[i])) {
        const gameRole = interaction.guild.roles.cache.find(x => x.name.toLowerCase() === values[i]);
        if (removeRoles.length != 0) {
          removeRoles.forEach(x => {
            interaction.member.roles.remove(x)
          });
        }
        interaction.member.roles.add(gameRole.id);
        addedRoles.push(gameRole.id);
      }
    }

    interaction.reply({ content: `${addedRoles.map(x => `<@&${x}>`).join(", ")} rolü başarıyla eklendi!`, ephemeral: true });
  }
})