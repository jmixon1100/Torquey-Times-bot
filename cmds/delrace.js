const Discord = require('discord.js');
const mysql = require("mysql");

module.exports.run = async (client, message, command, con) => {
    let embed = new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setAuthor('Torquey', 'https://i.imgur.com/iUENYyo.png');

    let rName = message.content.substr(message.content.indexOf('\"') + 1,
        (message.content.lastIndexOf('\"') - message.content.indexOf('\"')) - 1);

    con.query(`SELECT racename FROM races WHERE racename = '${rName}'`, function (err, result, fields) {
        if (err) throw err;
        const temp = result;
        var tempN = Object.entries(temp).length === 0;

        if (!tempN) {
            embed.setTitle(`Are you sure you want to delete ${rName}? \n (You have 1 min)`);
            message.channel.send(embed).then(async msg => {

                await msg.react('👍');
                await msg.react('👎');

                msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first();

                        if (reaction.emoji.name === '👍') {
                            embed.setTitle("Okay, I\'m deleting").setDescription(`\"${rName}\"`);
                            message.channel.send(embed)
                            con.query(`DELETE FROM races WHERE racename = '${rName}'`, function (err, result) {
                                if (err) throw err;
                            });
                            con.query(`DELETE FROM users WHERE racename = '${rName}'`, function (err, result) {
                                if (err) throw err;
                            });
                        }
                        else {
                            message.reply('you reacted with a thumbs down.');
                        }
                    }).catch(collected => {
                        console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
                        message.reply('you didn\'t react with neither a thumbs up, nor a thumbs down.');
                    });
            });

            const filter = (reaction, user) => {
                return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
            };
        }
        else {
            embed.setTitle(`Sorry "${rName}" Doesn't Exist`);
            message.channel.send(embed.setThumbnail('https://i.imgur.com/yKd8u1J.png'));
        }
    });


}
module.exports.help = {
    name: "delrace"
}