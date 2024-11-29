const DiscordCommand = require('../../contracts/DiscordCommand');
const fs = require('fs');
const axios = require('axios');
const ImgurAnonymousUploader = require('imgur-anonymous-uploader');

const uploader = new ImgurAnonymousUploader("318214bc4f4717f");



async function upload(imageUrl) {
    try {
        // Get the image data from the URL
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageData = Buffer.from(imageResponse.data, 'binary').toString('base64');

        // Upload the image data to Imgur
        const response = await uploader.uploadBuffer(imageResponse.data)
        return response;
    } catch (error) {
        console.error("Upload Failed", error.message);
        throw error; // Rethrow the error for the caller to handle
    }
}

async function imgurID(url) {
    try {
        // Fetch data from the provided URL
        const response = await axios.get(url);
        const imageDataArray = response.data; // Array of image data objects

        // Extract the URL of the first image object
        const imageUrl = imageDataArray.url;

        // Upload the image to Imgur
        const imageLink = await upload(imageUrl);
        return imageLink.url; // Return the uploaded image link
    } catch (error) {
        console.error("imgurID Failed", error.message);
        return null; // or handle error appropriately
    }
}
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
async function getCatPic() {
    try {
        const imgurIDValue = await imgurID("https://random-d.uk/api/v2/random");
        if (imgurIDValue) {
          console.log(imgurIDValue)
            return imgurIDValue;
        } else {
            return "Failed to get Imgur ID for cat picture, try again in a few seconds";
        }
    } catch (error) {
        console.error("getCatPic Failed", error.message);
        return "Failed to get cat picture"; // or handle error appropriately
    }
}



class DuckCommand extends DiscordCommand {
    constructor(discord) {
        super(discord)
        this.permission = "all"

        this.name = "duck";
        this.aliases = ["ducky", "ducks", "duckysougly", "duckysolucky"];
        this.description = "Random image of a ducks.";
        this.options = [];
    }

    onCommand(message) {
        
        getCatPic().then(cat => {
          message.channel.send({
            embeds: [{
              image: {
                url: cat,
              },
              color: 0x2A2A2A,
              timestamp: new Date(),
              footer: {
                text: "BOT",
              },
            }],
          })
        })
    }
}

module.exports = DuckCommand;