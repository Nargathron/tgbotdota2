const { Client, Intents } = require("discord.js");
const dotenv = require("dotenv");
const express = require("express");
const app = express();
const axios = require("axios");
const bodyParser = require("body-parser");
const { response } = require("express");
const port = 80;
const url = "https://api.telegram.org/bot";

require("dotenv").config();
apiToken = process.env.TG_TOKEN;
app.use(bodyParser.json());
var chat_id = process.env.CHAT_ID;
const intents = new Intents(32767);
const client = new Client({
  intents,
});

var voiceChannelsUsers = [];

//express
app.post("/", (req, res) => {
  console.log(req.body.message);
  res.send(req.body);
  const chatId = req.body.message.chat.id;
  const sentMessage = req.body.message.text;
  if (sentMessage === "/yesorno@CamunityBot") {
    axios.get("https://yesno.wtf/api").then((res) => {
      console.log(res.data.image);
      var image = res.data.image;
      axios.post(`${url}${apiToken}/sendAnimation`, {
        chat_id: chatId,
        animation: image,
      });
    });
  }
  if (sentMessage === "/roll@CamunityBot") {
    roll = Math.floor(Math.random() * 100);
    response = req.body.message.from.username + " выкинул " + roll;
    axios.post(`${url}${apiToken}/sendMessage`, {
      chat_id: chatId,
      text: response,
    });
  }
  if (sentMessage === "/go@CamunityBot") {
    axios.post(`${url}${apiToken}/sendMessage`, {
      chat_id: chatId,
      text:
        req.body.message.from.username +
        " собирает помоек: @n0n3x1s7 @FL00D @Gubernateur @Mikhai11 @gitaroshei @Borgyy @Durdom",
    });
  }
  if (sentMessage === "/disco@CamunityBot") {
    let text = [];
    const getUsers = async () => {
      const guild = await client.guilds.cache.get("385379150535458816");
      const vc = guild.channels.cache.get("510566162438815775");
      vc.members.map((user) => {
        console.log(user.presence?.activities[0]);
        if (!user.presence?.activities[0]) {
          text += user.user.username + " - Прост сидит\n";
        } else if (user.presence?.activities[0]) {
          var time = new Date(user.presence?.activities[0].timestamps.start)
            .toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })
            .slice(12, 20);
          text +=
            user.user.username +
            " - играет в " +
            user.presence?.activities[0].name +
            " зашел в " +
            time +
            "\n";
        }
        console.log(text);
      });
      // axios.post(`${url}${apiToken}/sendMessage`, {
      //   chat_id: chatId,
      //   text,
      // });
    };
    getUsers();
  }
});
// const user = await guild.members.cache.get("289472906386210819");
// const voiceChatUsers = await guild.channels.get("510566162438815775");
// console.log(user.presence?.activities[0].name);

//   var users = "";
//   var str = "";

//   voiceChannelsUsers.map((user) => {
//     users += user.name + " ебошит в " + user.activity + "\n";
//   });
//   if (voiceChannelsUsers.length == 1) {
//     str = "ебатель";
//   } else if (voiceChannelsUsers.length == 2) {
//     str = "ебателя";
//   } else if (voiceChannelsUsers.length == 3) {
//     str = "ебателя";
//   } else if (voiceChannelsUsers.length == 4) {
//     str = "ебателя";
//   } else if (voiceChannelsUsers.length >= 5) {
//     str = "ебателей";
//   }
//   if (
//     voiceChannelsUsers.length == 0
//       ? (response = "Ебатели отсутствуют")
//       : (response =
//           "В голосовом чате сейчас (" +
//           voiceChannelsUsers.length +
//           ") " +
//           str +
//           ":\n" +
//           users)
//   ) {
//     axios.post(`${url}${apiToken}/sendMessage`, {
//       chat_id: chatId,
//       text: response,
//     });
//   }
// }

//bots

client.on("ready", async () => {
  console.log("Discord bot is ready");
});

client.on("voiceStateUpdate", (oldState, newState) => {
  // Listeing to the voiceStateUpdate event
  var activity = "";
  if (newState.channel && !oldState.channel) {
    // The member connected to a channel.
    axios.post(`${url}${apiToken}/sendMessage`, {
      chat_id: chat_id,
      text: `${newState.member.user.username} зашел в Дискорд`,
    });
    if (newState.member.presence.activities != "") {
      activity = newState.member.presence.activities[0].name;
    } else {
      activity = "ничто";
    }
    user = {
      name: newState.member.user.username,
      activity: activity,
    };
    console.log(user);
    voiceChannelsUsers.push(user);
  }

  if (!newState.channel && oldState.channel) {
    // The member connected to a channel.
    axios.post(`${url}${apiToken}/sendMessage`, {
      chat_id: chat_id,
      text: `${newState.member.user.username} вышел из Дискорда`,
    });

    voiceChannelsUsers = voiceChannelsUsers.filter(
      (user) => user.name != newState.member.user.username
    );
  }
});

client.login(process.env.DISCORD_TOKEN);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
