const Discord = require('discord.js');
const mysql = require("mysql");
module.exports.run = async (client, message, command, con) => {
    const user = message.mentions.users.first() || message.author;
    var embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`Personal Bests`)
        .setThumbnail(`${user.displayAvatarURL()}`)
        .setAuthor(`${user.tag}`, `${user.displayAvatarURL()}`);
    

    console.log(user);
    con.query(`SELECT racename, times FROM users WHERE id = '${user.id}'`, async function (err, result, fields) {
        if (err) throw err;
        let tempT;
        var tempN = Object.entries(result).length === 0;
        if (!tempN) {
            result.forEach(async function (result) {
                console.log(` ${result.racename} + ${result.times} `);
                if (result.time == 89) {
                    tempT = "Invalid Time"
                }
                else {
                    tempT = "0" + JSON.stringify(result.times);
                    tempT = tempT.substr(0, 2) + ':' + tempT.substr(2, 2) + '.' + tempT.substr(4);
                }
                embed.addFields({ name: `${result.racename}`, value: `${tempT}` });
            });
            await message.channel.send(embed);
        }
        else {
            embed.setTitle(`Sorry either "${user.tag}" doesn't exist or "${user.tag}" has no times yet`);
            message.channel.send(embed.setThumbnail('https://i.imgur.com/yKd8u1J.png'));
        }
    });
}
module.exports.help = {
    name: "pb"
}
