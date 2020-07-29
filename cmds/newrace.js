const Discord = require('discord.js');
const mysql = require("mysql");

module.exports.run = async (client, message, command, con) => {
    let embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setAuthor('Torquey', 'https://i.imgur.com/iUENYyo.png')
    let rName = message.content.substr(message.content.indexOf('\"') + 1,
        (message.content.lastIndexOf('\"') - message.content.indexOf('\"')) - 1);

    con.query(`SELECT racename FROM races WHERE racename = '${rName}'`, function (err, result, fields) {
        if (err) throw err;
        const temp = result;
        var tempN = Object.entries(temp).length === 0;

        if (tempN) {
            con.query(`INSERT INTO races (racename, time, id) VALUES ('${rName}', '9999999', 0)`, function (err, result) {
                if (err) throw err;
            });

            embed.setTitle('New Race').setDescription(`\"${rName}\"`);
            message.channel.send(embed);
        }
        else {
            embed.setTitle("Sorry That Race Already Exists");
            message.channel.send(embed.setThumbnail('https://i.imgur.com/yKd8u1J.png'));
        }
    });
}

module.exports.help = {
    name: "newrace"
}
