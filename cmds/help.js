const Discord = require('discord.js');
const mysql = require("mysql");

module.exports.run = async (client, message, command, con) => {
    let embed = new Discord.MessageEmbed()
        .setColor('#03bb85')
        .setAuthor('Torquey')
        .setTitle('Command List')
        .setThumbnail('https://i.imgur.com/iUENYyo.png')
        .setDescription("Commands are not case sensitive but, they are format sensitive!")
        .addFields(
            { name: 'Adds a new race to the database.', value: '>newRace \"<Race Name>\"' },
            { name: 'Deletes Race from database along with times.', value: '>delRace \"<Race Name>\"' },
            { name: 'Adds new fastest time for \"<race>\" and logs ID of person mentioned who set Time. (if not mentioned the author holds the time) ', value: '>newTime MM.SS.FFF \"<Race Name>\" @<Time Setter>' },
            { name: '(Deprecated) Shows current fastest time for \"<race>\"', value: '>ScoreBoard \"<Race Name>\"' },
            { name: 'Shows all races and times in database', value: '>list' },
            { name: 'Shows personal bests for all logged races by @<mention>', value: '>pb @<mention>'}
        )
    message.channel.send(embed)

}
module.exports.help = {
    name: "help"
}
