const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { BotOwners } = require('../../../config.js');
const { post } = require("node-superfetch");

module.exports = {
    name: "eval",
    aliases: [],

    execute: async (client, message, args) => {
        if (!BotOwners.some(tk => message.member.user.id == tk)) return message.reply({ content: `Yetkin bulunmuyor.` })
        const embed = new EmbedBuilder()
            .addFields([{ name: "Input", value: "```js\n" + args.join(" ") + "```" }
            ])
        try {
            const code = args.join(" ");
            if (!code) return message.channel.send("Hmm sen bir yazılımcısın..");
            let evaled;

            if (code.includes(`secret`) || code.includes(`token`) || code.includes("process.env")) {
                evaled = "aldınmı başı";
            } else {
                evaled = await eval(code);
            }

            if (typeof evaled !== "string") evaled = await require("util").inspect(evaled, { depth: 0 });

            let output = clean(evaled);
            if (output.length > 1024) {

                const { body } = await post("https://hastebin.com/documents").send(output);
                embed.addFields([{ name: "Output", value: `https://hastebin.com/${body.key}.js`, inline: true }]).setColor(client.embedColor);

            } else {
                embed.addFields([{ name: "Output", value: "```js\n" + output + "```", inline: true }]).setColor(client.embedColor);
            }

            message.channel.send({ embeds: [embed] });

        } catch (error) {
            let err = clean(error);
            if (err.length > 1024) {

                const { body } = await post("https://hastebin.com/documents").send(err);
                embed.addFields([{ name: "Output", value: `https://hastebin.com/${body.key}.js`, inline: true }]).setColor("Red");
            } else {
                embed.addFields([{ name: "Output", value: "```js\n" + err + "```", inline: true }]).setColor("Red");
            }

            message.channel.send({ embeds: [embed] });
        }

    }
}
function clean(string) {
    if (typeof text === "string") {
        return string.replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203))
    } else {
        return string;
    }
}

