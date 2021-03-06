const { Client, Intents } = require("discord.js");
const dotenv = require("dotenv");
const express = require("express");
const app = express();
const axios = require("axios");
const bodyParser = require("body-parser");
const { response } = require("express");
const port = 80;
const url = "https://api.telegram.org/bot";

var accounts = [
  {
    name: "Borgyy",
    steamId: 180286854,
  },
  {
    name: "Mikhai11",
    steamId: 82648981,
  },
  {
    name: "n0n3x1s7",
    steamId: 847253860,
  },
  {
    name: "FL00D",
    steamId: 921667811,
  },
  {
    name: "Bobash11",
    steamId: 195352440,
  },
  {
    name: "gitaroshei",
    steamId: 423799577,
  },
  {
    name: "Gubernateur",
    steamId: 385633025,
  },
];

require("dotenv").config();
apiToken = process.env.TG_TOKEN;
app.use(bodyParser.json());
var chat_id = process.env.CHAT_ID;
const intents = new Intents(32767);
const client = new Client({
  intents,
});

//express
app.post("/", (req, res) => {
  // console.log(req.body.message);
  res.send(req.body);
  if (req.body.callback_query) {
    var matchId = req.body.callback_query.data;
    var chatCallbackId = req.body.callback_query.message.chat.id;
    const getStatsFromMatchId = async () => {
      const stats = axios.get(
        `https://tg.borgyy.gq/tg/getMatchStat/${matchId}`
      );
      const matchStats = await stats;
      var resp = [];
      matchStats.data.match.players.map((player) => {
        resp +=
          "\n" +
          "<b>Nick: </b> " +
          "<i>" +
          player.steamAccount.name +
          "</i>" +
          "\n" +
          "<b>Hero:</b> " +
          player.hero.name.slice(14, player.hero.name.length) +
          " <b>kda: </b>" +
          "<u>" +
          player.kills +
          "/" +
          player.deaths +
          "/" +
          player.assists +
          "</u>" +
          " <b>networth:</b> " +
          "<u>" +
          player.networth +
          "</u>" +
          " <b>herodamage:</b> " +
          "<u>" +
          player.heroDamage +
          "</u>" +
          "\n" +
          "???????????????????????????????????????";
      });
      return resp;
    };
    getStatsFromMatchId().then((resp) => {
      axios.post(`${url}${apiToken}/sendMessage`, {
        chat_id: chatCallbackId,
        parse_mode: "HTML",
        text: resp,
      });
    });
  }
  if (req.body.message) {
    var chatId = req.body.message.chat.id;
    var sentMessage = req.body.message.text;
  }
  if (sentMessage === "/getlast5@CamunityBot") {
    var acc = accounts.find(
      (account) => account.name === req.body.message.from.username
    );
    const getMatches = async () => {
      if (acc.steamId) {
        var matchesPromise = await axios.get(
          `https://tg.borgyy.gq/tg/getMatches/${acc.steamId}`
        );
        const matches = await matchesPromise.data.matches;
        return matches.slice(0, 5);
      }
    };
    const createKeyboard = async () => {
      const matches = await getMatches();
      const keyboard = [];
      matches.map((match) => {
        var date = new Date(match.parsedDateTime * 1000)
          .toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })
          .slice(0, 20);
        keyboard.push([
          {
            text: "???????? id: " + match.id + " ?? " + date,
            callback_data: match.id,
          },
        ]);
      });
      return keyboard;
    };
    createKeyboard().then((keyboard) => {
      var resp = req.body.message.from.username + ", ???????????? ????????";
      var chatId = req.body.message.chat.id;
      const k = { inline_keyboard: keyboard };
      axios.post(`${url}${apiToken}/sendMessage`, {
        chat_id: chatId,
        text: resp,
        // parse_mode: "HTML",
        reply_markup: JSON.stringify(k),
      });
    });
  }

  if (sentMessage === "/roll@CamunityBot") {
    const roll = Math.floor(Math.random() * 100);
    const response = req.body.message.from.username + " ?????????????? " + roll;
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
        " ???????????????? ????????????: @n0n3x1s7 @FL00D @Gubernateur @Mikhai11 @gitaroshei @Borgyy @Durdom ?? ?????????????? @Bobash11 550 ???????????? ",
    });
  }
  if (sentMessage === "/disco@CamunityBot") {
    text = [];
    const getUsers = async () => {
      const guild = await client.guilds.cache.get("385379150535458816");
      const vc = guild.channels.cache.get("510566162438815775");
      vc.members.map((user) => {
        if (!user.presence?.activities[0]) {
          text += user.user.username + " - ?????????? ??????????\n";
        } else if (user.presence?.activities[0]) {
          var time = new Date(user.presence?.activities[0].timestamps.start)
            .toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })
            .slice(12, 20);
          text +=
            user.user.username +
            " - ???????????? ?? " +
            user.presence?.activities[0].name +
            " c " +
            time +
            "\n";
        }
      });
      if (text.length === 0) {
        text = "???????????? ??????..";
      }
      axios.post(`${url}${apiToken}/sendMessage`, {
        chat_id: chatId,
        text,
      });
    };
    getUsers();
  }
});

client.on("ready", async () => {
  console.log("Discord bot is ready");
});

client.on("voiceStateUpdate", (oldState, newState) => {
  if (newState.channel && !oldState.channel) {
    axios.post(`${url}${apiToken}/sendMessage`, {
      chat_id: chat_id,
      text: `${newState.member.user.username} ?????????? ?? ??????????????`,
    });
  }

  if (!newState.channel && oldState.channel) {
    // The member connected to a channel.
    axios.post(`${url}${apiToken}/sendMessage`, {
      chat_id: chat_id,
      text: `${newState.member.user.username} ?????????? ???? ????????????????`,
    });
  }
});

client.login(process.env.DISCORD_TOKEN);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
