const Discord = require('discord.js');
const fs = require("fs");
const client = new Discord.Client();
const mysql = require("mysql");
const { throws } = require('assert');
client.commands = new Discord.Collection();

// Requires Config file within directory 
const {
    prefix,
    token,
    host,
    user,
    password,
    database
} = require('./config.json');

//=================================================//

//adds commands from cmd folder and makes them callable.

fs.readdir("./cmds/", (err, files) => {

    if (err) console.error(err);

    let jsFiles = files.filter(f => f.split(".").pop() === "js");

    if (jsFiles.length <= 0) {
        console.log("No Commands To Load");
        return;
    }
    console.log(`loading ${jsFiles.length} commands!`);

    jsFiles.forEach((f, i) => {
        let props = require(`./cmds/${f}`);
        console.log(`${i + 1} : ${f} loaded!`);
        client.commands.set(props.help.name, props);
    });
})

//=================================================//

client.once('ready', () => {
    console.log(client.commands);
    console.log('Ready!');
});

client.once('reconnecting', () => {
    console.log('Reconnecting!');
});

client.once('disconnect', () => {
    console.log('Disconnect!');
});

var con = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database

});

/*========================================================
   i have no fucking clue what these do but the code runs
=========================================================*/

var pool = mysql.createPool(con);

pool.on('acquire', con => {
    console.log('Connection %d acquired', con.threadId);
});

pool.on('connection', con => {
    console.log("here");
    logger.info('Connected the database via threadId %d!!', con.threadId);
    con.query('SET SESSION auto_increment_increment=1');
});

pool.on('enqueue', function () {
    console.log('Waiting for available connection slot');
});

pool.on('release', connection => {
    console.log('Connection %d released', connection.threadId);
});

//===================================================
//===================================================

// con.connect(err => { 
//     if(err) throw err;
//     console.log("connedted to database")
//     con.query("SHOW TABLES", console.log)
// });



client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;


    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    let cmd = client.commands.get(command);
    if (cmd) {
        cmd.run(client, message, command, con);
    }
    else {
        message.channel.send("Please enter valid command!");
        console.log(command);
    }
    console.log(message.author.createdAt
        + "\n"
        + "Author: "
        + message.author.tag + "\n"
        + "Message:" + message.content + "\n"
    );
});
client.login(token);