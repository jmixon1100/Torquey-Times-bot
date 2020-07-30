const Discord = require('discord.js');
const mysql = require("mysql");
module.exports.run = async (client, message, command, con) => {
    con.query('SELECT racename, time, id FROM races ', async function (err, result, fields) {
        if (err) throw err;
        console.log(result.length);
        console.log(result[0].racename);
        
    });
}

module.exports.help = {
    name: "test"
}