const Discord = require("discord.js");
const client = new Discord.Client();
const secret = require("./secret");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

let matt = {
  justPosted: false,
  timer: null,
  recentMessages: []
};

const concatAndSend = lastMsg => {
  let content = [];
  matt.recentMessages.forEach((message, index) => {
    if (
      //already punctuated, do nothing
      /[^\w\s]/.test(message.content.slice(-1))
    ) {
      content.push(message.content);
    } else if (
      //last message, or long message, add period.
      index === matt.recentMessages.length - 1 ||
      message.content.length >= 50
    ) {
      content.push(message.content + ".");
    } else if (message.content.length >= 10) {
      content.push(message.content + ",");
    } else {
      content.push(message.content);
    }
    message.delete();
  });
  lastMsg.channel.send(content.join(" "));
};

const timerEnd = lastMsg => {
  if (matt.recentMessages.length >= 2) {
    concatAndSend(lastMsg);
  }
  matt.justPosted = false;
  matt.recentMessages = [];
};

const startTimer = msg => {
  matt.justPosted = true;
  matt.recentMessages.push(msg);
  matt.timer = setTimeout(timerEnd, 10000, msg);
};

//every time somebody posts a message
client.on("message", msg => {
  //and that somebody was matt
  if (msg.author.discriminator === "2244") {
    //and if matt had just posted, reset the timer and save the message
    if (matt.justPosted) {
      clearTimeout(matt.timer);
    }
    startTimer(msg);
  } else if (!msg.author.bot) {
    timerEnd(msg);
  }
});

client.login(secret.secret_code);
