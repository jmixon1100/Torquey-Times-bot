const Discord = require('discord.js');
const mysql = require("mysql");

module.exports.run = async (client, message, command, con) => {

    let embed = new Discord.MessageEmbed()
        .setColor('#FFFF00')

    let rName = message.content.substr(message.content.indexOf('\"') + 1,
        (message.content.lastIndexOf('\"') - message.content.indexOf('\"')) - 1);

    var tempT = message.content.substr(message.content.indexOf('\:') - 2, 9);
    var oldTime;
    if (tempT.includes(':') && tempT.includes('.')) {

        const user = message.mentions.users.first() || message.author;
        console.log(user)
        con.query(`SELECT time FROM races WHERE racename = '${rName}'`, function (err, result, fields) {
            if (err) throw err;
            if (result.length > 0) {
                oldTime = result[0].time;

                embed.setTitle(`Is this the correct time for this race? \n (You have 1 min)`).setDescription(`${rName}: ${tempT}`);

                message.channel.send(embed).then(async msg => {

                    await msg.react('👍');
                    await msg.react('👎');
                    msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                        .then(collected => {
                            const reaction = collected.first();
                            if (reaction.emoji.name === '👍') {
                                try {

                                    const tempX = parseInt((tempT.replace(':', '')).replace('.', ''));

                                    con.query(`SELECT times FROM users WHERE racename = '${rName}' AND id = '${user.id}'`, function (err, result, fields) {
                                        if (err) throw err;
                                        try {

                                            if (result[0].times > tempX) {
                                                con.query(`INSERT INTO users (racename, times, id) VALUES ('${rName}', '${tempX}', ${user.id})`, function (err, result) {
                                                    if (err) throw err;

                                                });
                                                con.query(`DELETE FROM users WHERE racename = '${rName}' AND times = '${result[0].times}' AND id = '${user.id}'`, function (err, result) {
                                                    if (err) throw err;
                                                });
                                                message.channel.send(embed.setTitle(`The New Best Time on \"${rName}\" for \"${user.tag}\"`)
                                                    .setDescription(tempT)
                                                    .setTimestamp(Date.now())
                                                    .setAuthor(`The New Leader Is ${user.tag}`, user.displayAvatarURL())
                                                    .setImage()
                                                    .setThumbnail());
                                            }
                                            else {
                                                message.channel.send(embed.setTitle("Sorry you have a faster time logged as your pb already")
                                                .setDescription("")
                                                .setThumbnail('https://i.imgur.com/yKd8u1J.png'));
                                            }
                                        } catch (error) {
                                            console.log(error);
                                            con.query(`INSERT INTO users (racename, times, id) VALUES ('${rName}', '${tempX}', ${user.id})`, function (err, result) {
                                                if (err) throw err;
                                                console.log(result);
                                            });
                                            message.channel.send(embed.setTitle(`The New Best Time on \"${rName}\" for \"${user.tag}\"`)
                                                .setDescription(tempT)
                                                .setTimestamp(Date.now())
                                                .setAuthor(`${user.tag}`, user.displayAvatarURL())
                                                .setImage()
                                                .setThumbnail()
                                            );
                                        }


                                    });
                                    if (oldTime > tempX) {
                                        con.query(`INSERT INTO races (racename, time, id) VALUES ('${rName}', '${tempX}', ${user.id})`, function (err, result) {
                                            if (err) throw err;
                                        });
                                        con.query(`DELETE FROM races WHERE racename = '${rName}' AND time = '${oldTime}'`, function (err, result) {
                                            if (err) throw err;
                                        });

                                        message.channel.send(embed.setTitle(`The New Best Time For "${rName}"`)
                                            .setDescription(tempT)
                                            .setTimestamp(Date.now())
                                            .setAuthor(`The New Leader Is ${user.tag}`, user.displayAvatarURL())
                                            .setImage()
                                            .setThumbnail());

                                    }
                                    else {
                                        con.query(`SELECT id, time FROM races WHERE racename = '${rName}'`, async function (err, result, fields) {
                                            if (err) throw err;
                                            //console.log(JSON.stringify(result));

                                            const oldmem = await client.users.fetch(result[0].id);
                                            let tempT = "0" + JSON.stringify(result[0].time);
                                            tempT = tempT.substr(0, 2) + ':' + tempT.substr(2, 2) + '.' + tempT.substr(4);

                                            await message.channel.send(embed.setTitle(`The Current Best Time For "${rName}"`)
                                                .setDescription(tempT)
                                                .setTimestamp(Date.now())
                                                .setThumbnail()
                                                .setAuthor(`The Leader Is Still ${oldmem.tag}`, oldmem.displayAvatarURL())).catch(console.error());


                                        });

                                    }
                                } catch (error) {
                                    console.error();
                                }
                            } else {
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
            }else{
                message.channel.send(embed.setDescription("Sorry make sure you follow the format 'MM:SS.FFF \"race name\" @mention' (Make sure you pad the time with a 0 if the time is less than 10 mins.) or the race listed may not exist :/")
            .setAuthor('Torquey', 'https://i.imgur.com/iUENYyo.png')
            .setImage('https://i.imgur.com/yKd8u1J.png'));
            }
        });

    } else {
        message.channel.send(embed.setDescription("Sorry make sure you follow the format 'MM:SS.FFF \"race name\" @mention' (Make sure you pad the time with a 0 if the time is less than 10 mins.) or the race listed may not exist :/")
            .setAuthor('Torquey', 'https://i.imgur.com/iUENYyo.png')
            .setImage('https://i.imgur.com/yKd8u1J.png'));
    }
}
module.exports.help = {
    name: "newtime"
}