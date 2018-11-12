const dotenv = require('dotenv').config()
const Discord = require('discord.js')
const fetch = require('node-fetch')

const client = new Discord.Client();

const buildStreamers = (body) => {
    let streamersInfo = ``
    streamersInfo += `Streamers online: ${body.total_online} / ${body.total_twini_channels}\n\n`
    body.streams.forEach(element => {
        streamersInfo += `👤 ${element.channel.display_name} | 👀 ${element.viewers} viewers | 🎮 ${element.channel.game} | 🎥 ${element.channel.status} (<${element.channel.url}>)\n\n`
    });
    return streamersInfo
}

const buildDonators = (body) => {
    let donatorsInfo = ``
    donatorsInfo += `Top 10 total donators\n\n`
    for (let index = 0; index < 10; index++) {
        const element = body.donators[index];
        if(index == 0)
            donatorsInfo += `🥇`
        else if(index == 1)
            donatorsInfo += `🥈`
        else if(index == 2)
            donatorsInfo += `🥉`
        donatorsInfo += element[0] + ` - ` + element[1] + ` NIM`
        donatorsInfo += `\n`
    }
    return donatorsInfo
}

client.on('message', async message => {
  if (message.content === '!live') {
    try {
        const res = await fetch("https://app.twinibot.com/api/channels")
        const body = await res.json()
        message.channel.send(buildStreamers(body));
    } catch (e) {
        console.log(e)
        message.channel.send(`Error while loading the information. Please try again later.`)    
    }
  }
  else if(message.content === '!donators') {
      try {
        const res = await fetch("https://app.twinibot.com/api/donators")
        const body = await res.json()
        message.channel.send(buildDonators(body));
      } catch (e) {
        console.log(e)
        message.channel.send(`Error while loading the information. Please try again later.`)    
      }
  }
  else if(message.content === '!help' || message.content === '!twini' || message.content === '!twinibot')
    message.channel.send(`List of commands:\n\n!donators - Show the top 10 total donators\n!live - Show a list of online streamers`)
});

client.login(process.env.CLIENT_ID);