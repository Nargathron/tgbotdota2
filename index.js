const { Client, Intents } = require('discord.js');
const dotenv = require('dotenv')
const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const port = 80;
const url = 'https://api.telegram.org/bot';

require('dotenv').config()
apiToken = process.env.TG_TOKEN;
app.use(bodyParser.json());
var chat_id = process.env.CHAT_ID;

//express
app.post('/', (req, res) => {
    console.log(req.body.message);
    res.send(req.body);
    const chatId = req.body.message.chat.id;
    const sentMessage = req.body.message.text;
    if (sentMessage === '/roll@CamunityBot') {
        roll = Math.floor(Math.random() * 100)
        response = req.body.message.from.username + ' выкинул ' + roll
        axios.post(`${url}${apiToken}/sendMessage`,
             {
                  chat_id: chatId,
                  text: response
             });
    }
    if (sentMessage === '/go@CamunityBot') {
        console.log('pipiska')
        axios.post(`${url}${apiToken}/sendMessage`,
             {
                  chat_id: chatId,
                  text: '@n0n3x1s7 @FL00D @Gubernateur @Mikhai11 @gitaroshei @Borgyy @Durdom го'
             });
   }
   if(sentMessage === '/disco@CamunityBot') {
       let response = '';
    if(voiceChannelsUsers.length == 0 ? response = 'Нет никого' : response = ('В голосовом чате сейчас : ' + voiceChannelsUsers.join())){
        axios.post(`${url}${apiToken}/sendMessage`,
        {
            chat_id: chatId,
            text: response
        });
      }
    }
});

//bots
var voiceChannelsUsers = [];
function removeUser(user){
    voiceChannelsUsers = voiceChannelsUsers.filter(e => e != user)
}

const intents = new Intents(32767)
const client = new Client({
    intents
})

client.on('ready', () =>{
    console.log('Dickscord bot is upppp')
})

client.on("voiceStateUpdate", (oldState, newState) => { // Listeing to the voiceStateUpdate event
    if (newState.channel && !oldState.channel) { // The member connected to a channel.
        console.log(newState.member.presence.activities[0].name)
        axios.post(`${url}${apiToken}/sendMessage`,
             {
                  chat_id: chat_id,
                  text: `${newState.member.user.username} зашел в Дискорд`
             });
        voiceChannelsUsers.push(newState.member.user.username);
    }
    if (!newState.channel && oldState.channel) { // The member connected to a channel.
        axios.post(`${url}${apiToken}/sendMessage`,
             {
                  chat_id: chat_id,
                  text: `${newState.member.user.username} Отключился`
             });
        removeUser(newState.member.user.username);
    }
});

client.login(process.env.DISCORD_TOKEN);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
