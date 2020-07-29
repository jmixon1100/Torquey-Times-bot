const Discord = require('discord.js');
const fs = require("fs");
const client = new Discord.Client();
client.commands = new Discord.Collection();
const {
    prefix,
    token,
    host,
    user,
    password,
    database
} = require('./config.json');

const mysql = require("mysql");
const { throws } = require('assert');

fs.readdir("./cmds/",(err, files) => {
    if(err) console.error(err);
    let jsFiles = files.filter( f => f.split(".").pop() === "js");
    if(jsFiles.length <= 0){
        console.log("No Commands To Load");
        return;
    }
    console.log(`loading ${jsFiles.length} commands!`);

    jsFiles.forEach((f,i) => {
        let props = require(`./cmds/${f}`);
        console.log(`${i +1} : ${f} loaded!`);
        client.commands.set(props.help.name, props);
    });
})



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

let pool = mysql.createPool(con);

pool.on('connection', function (_conn) {
    if (_conn) {
        logger.info('Connected the database via threadId %d!!', _conn.threadId);
        _conn.query('SET SESSION auto_increment_increment=1');
    }
});

con.connect(err => { 
    if(err) throw err;
    console.log("connedted to database")
    con.query("SHOW TABLES", console.log)
});



client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;


    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    let cmd = client.commands.get(command);
    if(cmd){
        cmd.run(client, message, command, con);
    }
    else {
        message.channel.send("Please enter valid command!");
        console.log(command);
    }
    console.log(message.author.createdAt 
        +"\n" 
        + "Author: " 
        + message.author.tag + "\n" 
        + "Message:" + message.content + "\n"
    );
});
client.login(token);