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

        //it looks bad and i feel bad
        var count = 0;
        let finishedSend;
        for (let i = 0; i < result.length; i++) {

            finishedSend = false;

            var temp, tempX, tempT;

            if (result[i].id == 0) {
                temp = 'undefined';
            }
            else {
                temp = await client.users.fetch(result[i].id);
            }

            console.log(`${result[i].racename} + ${result[i].time} + ${result[i].id}`)

            if (result[i].time != 9999999) {
                if (result[i].time != 89) {
                    tempT = "0" + JSON.stringify(result[i].time);
                    tempT = tempT.substr(0, 2) + ':' + tempT.substr(2, 2) + '.' + tempT.substr(4);
                }
                else {
                    tempT = "Invalid Time"
                }
                tempX = `${tempT} set by: ${temp}`
            }
            else {
                tempX = "No Time Set Yet";
            }

            count++;

            if (count < 10) {
                embed.addFields({ name: `${result[i].racename}`, value: `${tempX}` });
            } else {

                message.channel.send(embed)

                embed.fields = [];
                count = 0;

                finishedSend = true;
            }

        }
        if(!finishedSend){
            message.channel.send(embed);
        }
        
    });
}
module.exports.help = {
    name: "list"
}
