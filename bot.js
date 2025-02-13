const { Client, Intents } = require('discord.js');
const fetch = require('node-fetch');
require('dotenv').config();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const GIPHY_API_KEY = process.env.GIPHY_API_KEY;
const OWNER_ID = process.env.OWNER_ID;

let avatarChannel, bannerChannel;

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  setInterval(sendRandomAvatar, 30 * 60 * 1000);
  setInterval(sendRandomBanner, 30 * 60 * 1000);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content === '!setavatar') {
    avatarChannel = message.channel.id;
    message.reply('Avatar channel set!');
  }

  if (message.content === '!setbanner') {
    bannerChannel = message.channel.id;
    message.reply('Banner channel set!');
  }

  if (message.content === '!owneronly' && message.author.id === OWNER_ID) {
    message.reply('This is an owner-only command!');
  }
});

async function sendRandomAvatar() {
  if (!avatarChannel) return;

  const url = `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API_KEY}&tag=avatar&rating=g`;
  const response = await fetch(url);
  const json = await response.json();

  const gifUrl = json.data.images.original.url;
  const channel = client.channels.cache.get(avatarChannel);
  channel.send(gifUrl);
}

async function sendRandomBanner() {
  if (!bannerChannel) return;

  const url = `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API_KEY}&tag=banner&rating=g`;
  const response = await fetch(url);
  const json = await response.json();

  const gifUrl = json.data.images.original.url;
  const channel = client.channels.cache.get(bannerChannel);
  channel.send(gifUrl);
}

client.login(process.env.DISCORD_TOKEN);