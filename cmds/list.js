const Discord = require('discord.js');
const mysql = require("mysql");
module.exports.run = async (client, message, command, con) => {
    var embed = new Discord.MessageEmbed()
        .setColor('#03bb85')
        .setAuthor('Torquey')
        .setTitle('Records And Race Names ')
        .setThumbnail('https://i.imgur.com/iUENYyo.png')

    con.query('SELECT racename, time, id FROM races ', async function (err, result, fields) {
        if (err) throw err;


        await result.forEach(async function (result) {
            console.log(`${result.racename} + ${result.time} + ${result.id}`)
            var temp, tempX, tempT;

            if (result.id == 0) {
                temp = 'undefined';
            }
            else {
                temp = await client.users.fetch(result.id);
            }

            if (result.time == 9999999) {
                tempX = "No Time Set Yet";
            }
            else {

                if (result.time == 89) {
                    tempT = "Invalid Time"
                }
                else {
                    tempT = "0" + JSON.stringify(result.time);
                    tempT = tempT.substr(0, 2) + ':' + tempT.substr(2, 2) + '.' + tempT.substr(4);
                }

                tempX = `${tempT} set by: ${temp}`;
            }

            embed.addFields({ name: `${result.racename}`, value: `${tempX}` });
        });

        message.channel.send(embed);

    });
}
module.exports.help = {
    name: "list"
}
