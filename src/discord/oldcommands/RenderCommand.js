const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");
const axios = require("axios");
const nbt = require('prismarine-nbt');
const Canvas = require('canvas');

const { url } = require('inspector');
const util = require('util');

Canvas.registerFont('./src/fonts/MinecraftRegular-Bmg3.ttf', { family: 'Minecraft' });
Canvas.registerFont('./src/fonts/minecraft-bold.otf', { family: 'MinecraftBold' });
Canvas.registerFont('./src/fonts/2_Minecraft-Italic.otf', { family: 'MinecraftItalic' });
Canvas.registerFont('./src/fonts/unifont.ttf', { family: 'MinecraftUnicode' });
const RGBA_COLOR = {
    0: 'rgba(0,0,0,1)',
    1: 'rgba(0,0,170,1)',
    2: 'rgba(0,170,0,1)',
    3: 'rgba(0,170,170,1)',
    4: 'rgba(170,0,0,1)',
    5: 'rgba(170,0,170,1)',
    6: 'rgba(255,170,0,1)',
    7: 'rgba(170,170,170,1)',
    8: 'rgba(85,85,85,1)',
    9: 'rgba(85,85,255,1)',
    a: 'rgba(85,255,85,1)',
    b: 'rgba(85,255,255,1)',
    c: 'rgba(255,85,85,1)',
    d: 'rgba(255,85,255,1)',
    e: 'rgba(255,255,85,1)',
    f: 'rgba(255,255,255,1)',
};

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
            while (offset >= charSet.length) {
                offset -= charSet.length
            }
            while (offset < 0) {
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
async function getCanvasWidthAndHeight(lore) {
    const canvas = Canvas.createCanvas(1, 1);
    const ctx = canvas.getContext('2d');
    ctx.font = '24px Minecraft';

    let highestWidth = 0;
    for (let i = 0; i < lore.length; i++) {
        const width = ctx.measureText(lore[i].replace(/\u00A7[0-9A-FK-OR]/gi, '')).width;
        if (width > highestWidth) {
            highestWidth = width;
        }
    }

    return { height: lore.length * 24 + 15, width: highestWidth + 60 };
}

async function renderLore(itemName, lore) {
    if (itemName) lore.unshift(itemName);
    const measurements = await getCanvasWidthAndHeight(lore);
    const canvas = Canvas.createCanvas(measurements.width, measurements.height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#100110';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.shadowColor = '#131313';
    ctx.font = '24px Minecraft';
    ctx.fillStyle = '#ffffff';

    for (const [index, item] of Object.entries(lore)) {
        let width = 10;
        const splitItem = item.split('§');
        if (splitItem[0].length == 0) splitItem.shift();

        for (const toRenderItem of splitItem) {
            ctx.fillStyle = RGBA_COLOR[toRenderItem[0]];

            if (toRenderItem.startsWith('l')) ctx.font = '24px MinecraftBold, MinecraftUnicode';
            else if (toRenderItem.startsWith('o')) ctx.font = '24px MinecraftItalic, MinecraftUnicode';
            else ctx.font = '24px Minecraft, MinecraftUnicode';

            ctx.fillText(toRenderItem.substring(1), width, index * 24 + 29);
            width += ctx.measureText(toRenderItem.substring(1)).width;
        }
    }

    return canvas.toBuffer();
}

async function getLastProfile(data) {
    const profiles = data.profiles;
    return profiles.sort((a, b) => b.selected - a.selected)[0];
}
const parseNbt = util.promisify(nbt.parse);
async function nameToUUID(name) {
    try {
        return (await axios.get(`https://api.mojang.com/users/profiles/minecraft/${name}`)).data.id;
    } catch (e) {
        return null;
    }
}
async function decodeData(buffer) {
    const parsedNbt = await parseNbt(buffer);
    return nbt.simplify(parsedNbt);
}
function isValidUsername(username) {
    if (username.match(/^[0-9a-zA-Z_]+$/)) {
        return true;
    } else {
        return false;
    }
}
async function getPlayer(player, profile) {
    if (typeof player !== 'string' || !isValidUsername(player)) {
        throw new Error('Invalid Username');
    }

    const mojangResponse = await nameToUUID(player);
    if (!mojangResponse) throw new Error('Player not found');
    const hypixelResponse = await axios.get(`https://api.hypixel.net/v2/skyblock/profiles?uuid=${mojangResponse}&key=${config.minecraft.API.hypixelAPIkey}`);
    if (!hypixelResponse) throw new Error("Couldn't get a response from the API");
    if (hypixelResponse.data.profiles === null) throw new Error(`Couldn\'t find any Skyblock profile that belongs to ${player}`);
    let profileData = await getLastProfile(hypixelResponse.data);
    if (profile) {
        profileData = hypixelResponse.profiles.find((p) => p.cute_name.toLowerCase() === profile.toLowerCase()) || getLastProfile(hypixelResponse.data);
    }
    if (!profileData) throw new Error(`Couldn't find the specified Skyblock profile that belongs to ${player}.`);
    return { memberData: profileData.members[mojangResponse], profileData, profiles: hypixelResponse.profiles };
}
async function getData(message) {
    let { 1: username, 2: profile, 3: itemNumber } = message.split(' ');
    if (!isNaN(Number(profile))) {
        itemNumber = profile;
        profile = undefined
    }

    if (itemNumber < 1 || itemNumber > 9 || !itemNumber)
        return "Invalid item number. Must be between 1 and 9."

    const searchedPlayer = await getPlayer(username, profile).catch((err) => {
        return err
    });
    const playerProfile = searchedPlayer.memberData;

    const inventory = playerProfile?.inventory.inv_contents?.data;
    if (!inventory) {
        return " has no items in their inventory or has their inventory API disabled."
    }

    const inventoryData = (await decodeData(Buffer.from(inventory, 'base64'))).i;
    const selectedItem = inventoryData[itemNumber - 1];
    if (!selectedItem || !Object.keys(selectedItem || {}).length) {
        return `This player does not have an item in slot ${itemNumber}.`;
    }

    const renderedItem = await renderLore(selectedItem?.tag?.display?.Name, selectedItem?.tag?.display?.Lore);

    const uploadResponse = await uploader.uploadBuffer(renderedItem);
    if (!uploadResponse.url) return `Failed to upload image.`;

    return `${uploadResponse.url}AWSSAW${username}`
}
async function getUUIDFromUsername(username) {
    if (!(/^[a-zA-Z0-9_]{2,16}$/mg.test(username))) {
        return "Error"
    }
    else {
        const { data } = await axios.get('https://api.mojang.com/users/profiles/minecraft/' + username)
        return data.id
    }
}
class RenderCommand extends DiscordCommand {
    constructor(discord) {
        super(discord)
        this.permission = "all"
        this.name = 'render'
        this.description = 'renders specified slot'
    }

     onCommand(message) {
        getData(message.content).then(returnurl => {
            returnurl = returnurl.split("AWSSAW")
            let username = returnurl[1]
            returnurl = returnurl[0]
            if(returnurl.toString().includes("imgur")){
                let game = Encode(returnurl)
                this.sendMinecraftMessage(`/gc ${username}: ${game}`)
                message.channel.send({
                    embeds: [{
                        image: {
                            url: returnurl,
                        },
                        color: 0x2A2A2A,
                        timestamp: new Date(),
                        footer: {
                            text: "BOT",
                        },
                        author: {
                            name: `${username}`,
                            icon_url: 'https://www.mc-heads.net/avatar/' + username,
                        },
                    }],
                })
            }
            else{
                this.sendMinecraftMessage(`/gc ${username}: ${returnurl}`)
                message.channel.send({
                    embeds: [{
                        description: returnurl,
                        color: 0x2A2A2A,
                        timestamp: new Date(),
                        footer: {
                            text: "BOT",
                        },
                        author: {
                            name: `${username}`,
                            icon_url: 'https://www.mc-heads.net/avatar/' + username,
                        },
                    }],
                })
            }
        })
    }
}

module.exports = RenderCommand
