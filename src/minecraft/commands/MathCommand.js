const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");
const axios = require("axios");
const fs = require('fs');

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
 }
 return result;
}

async function math(message){
    message = message.split(" ")
    message.shift()
    message = message.join(" ")
    let data
    let ret 
    try {
      data = await axios.get("http://api.mathjs.org/v4/?expr=" + encodeURIComponent(message.replace(/x/gi, "*")))
      ret = data.data
    }
    catch{
      ret = "Error"
    }
    let ret1
    let ret2
    ret1 = ret.toString().split(".")[0]
    ret2 = ret.toString().split(".")[1]
    ret1 = ret1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if(ret2 != undefined){
      ret=ret1+"."+ret2
    }
    else{
      ret=ret1
    }
    return ret
}

class MathCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'math'
    this.aliases = ["calc"]
    this.description = 'Math.'
  }

  onCommand(username, message){
    

    if(username.toLowerCase()=="yespleases") return
    math(message).then(data=>{
      this.send(`/gc ${data} - ${makeid(8)}`)
    })
  }
}

module.exports = MathCommand
