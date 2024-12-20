const { getRarityColor, formatUsername } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");
const { uploadImage } = require("../../contracts/API/imgurAPI.js");
const { renderLore } = require("../../contracts/renderItem.js");
const getPets = require("../../../API/stats/pets.js");
function charInc(str, int) {
  const charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let incrementedStr = '';
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    let index = charSet.indexOf(char);

    if (index == -1) {
      incrementedStr += char;
    } else {
      let offset = index + int
      while(offset >= charSet.length){
        offset -= charSet.length
      }
      while(offset < 0){
        offset += charSet.length
      }
      let nextChar = charSet[offset];
      incrementedStr += nextChar;
    }
  }
  return incrementedStr;
}
function decode(string) {
  if (!string.startsWith('l$')) {
    throw new Error('String does not appear to be in STuF');
  }
  let prefix = string[2];
  let suffix = string[3];
  let dotIndices = string.slice(4, string.indexOf('|')).split('').map(Number);
  let urlBody = string.slice(string.indexOf('|') + 1);

  let first9 = urlBody.slice(0, 9 - dotIndices.length);
  let then = urlBody.slice(9 - dotIndices.length).replace(/\^/g, '.');

  let url = first9 + then;
  url = charInc(url, -1)

  // Restore the dots in the first part of the URL
  dotIndices.forEach((index) => {
    url = url.slice(0, index) + '.' + url.slice(index);
  });

  // Add the prefix back
  if (prefix === 'h') {
    url = 'http://' + url;
  } else if (prefix === 'H') {
    url = 'https://' + url;
  }

  // Add the suffix back
  if (suffix === '1') {
    url += '.png';
  } else if (suffix === '2') {
    url += '.jpg';
  } else if (suffix === '3') {
    url += '.jpeg';
  } else if (suffix === '4') {
    url += '.gif';
  }

  return url;
}
function Encode(url) {
  let encoded = "l$"
  if (url.startsWith('http://')) {
    encoded += 'h';
    url = url.slice(7); // Remove the 'http://' part
  } else if (url.startsWith('https://')) {
    encoded += 'H';
    url = url.slice(8); // Remove the 'https://' part
  }

  if (url.endsWith('.png')) {
    encoded += '1';
    url = url.slice(0, -4); // Remove the '.png' part
  } else if (url.endsWith('.jpg')) {
    encoded += '2';
    url = url.slice(0, -4); // Remove the '.jpg' part
  } else if (url.endsWith('.jpeg')) {
    encoded += '3';
    url = url.slice(0, -5); // Remove the '.jpeg' part
  } else if (url.endsWith('.gif')) {
    encoded += '4';
    url = url.slice(0, -4); // Remove the '.gif' part
  } else {
    encoded += '0';
  }

  let dotIndices = [];
  for (let i = 0; (i < url.length) && (i <= 8); i++) {
    if (url[i] === '.') {
      dotIndices.push(i);
      if (dotIndices.length === 9) break; // Stop after 9 dots
    }
  }

  let first9 = url.substring(0, 9)
  let then = url.substring(9).replace(/\./g, '^');
  first9 = first9.replace(/\./g, '');
  let shifted = charInc(first9 + then, 1)

  encoded += dotIndices.map(index => index.toString()).join('') + '|';
  encoded += shifted


  return encoded;
}
class RenderCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "pet";
    this.aliases = ["pets"];
    this.description = "Renders active pet of specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
    ];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData?.game_mode);
      const profile = getPets(data.profile);
      if (profile.length === 0) {
        return this.send(`/gc ${username} does not have any pets.`);
      }

      const pet = profile.pets.find((pet) => pet.active === true);

      if (pet === undefined) {
        return this.send(`/gc ${username} does not have pet equiped.`);
      }

      const renderedItem = await renderLore(
        `§7[Lvl ${pet.level}] §${getRarityColor(pet.tier)}${pet.display_name}`,
        pet.lore,
      );

      const upload = await uploadImage(renderedItem);

      imgurUrl = upload.url
      this.minecraft.broadcastImage({username: username, url: imgurUrl})

      return this.send(`/gc ${username}'s Active Pet: ${Encode(imgurUrl)}`);
    } catch (error) {
      console.log(error);
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}

module.exports = RenderCommand;
