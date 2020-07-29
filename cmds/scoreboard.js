const Discord = require('discord.js');
const mysql = require("mysql");

module.exports.run = async (client, message, command, con) => {
    let embed = new Discord.MessageEmbed()
        .setColor('#008000')

    let rName = message.content.substr(message.content.indexOf('\"') + 1,
        (message.content.lastIndexOf('\"') - message.content.indexOf('\"')) - 1);
    con.query(`SELECT id, time FROM races WHERE racename = '${rName}'`, async function (err, result, fields) {
        if (err) throw err;

        let temp = JSON.stringify(result);

        if (temp.length < 4) {
            embed.setTitle(`Sorry "${rName}" Doesn't Exist`);
            message.channel.send(embed.setThumbnail('https://i.imgur.com/yKd8u1J.png'));
        }
        else {
            let tempT = temp.substr(temp.indexOf('\"time\"') + 7, 7);
            if (tempT.includes('}')) {
                tempT = tempT.replace('}', '');
                tempT = '0' + tempT;
                tempT = tempT.substr(0, 2) + ':' + tempT.substr(2, 2) + '.' + tempT.substr(4);
            }
            else {
                tempT = tempT.substr(0, 2) + ':' + tempT.substr(2, 2) + '.' + tempT.substr(4);
            }
            let tempID = temp.substr(temp.indexOf("id") + 5, temp.indexOf(',') - 9);

            const oldmem = await client.users.fetch(tempID);

            await message.channel.send(embed.setTitle(`The Current Best Time For "${rName}"`)
                .setDescription(tempT)
                .setTimestamp(Date.now())
                .setAuthor(`The Leader Is Still ${oldmem.tag}`, oldmem.displayAvatarURL()));
        }
    });
}
module.exports.help = {
    name: "scoreboard"
}