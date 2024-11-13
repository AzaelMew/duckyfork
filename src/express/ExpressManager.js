const express = require('express')
const config = require("../../config.json");
const Logger = require(".././Logger.js");

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
 return result;
}

class ExpressManager {
  constructor(app) {
    this.app = app
    this.express = express()
    this.router = express.Router()
  }

  initialize() {

    this.router.post('/kick', this.kick.bind(this))
    this.router.post('/mute', this.mute.bind(this))
    this.router.post('/unmute', this.unMute.bind(this))
    this.router.post('/promote', this.promote.bind(this))
    this.router.post('/demote', this.demote.bind(this))
    this.router.post('/override', this.override.bind(this))
    this.router.post('/invite', this.invite.bind(this))
    this.router.post('/setrank', this.setRank.bind(this))
    this.router.post('/patchnotes', this.patchnotes.bind(this))
    this.router.post('/mutechat', this.mutechat.bind(this))
    this.router.post('/message', this.message.bind(this))
    this.router.post('/command', this.command.bind(this))

    this.express.use(express.json(), express.urlencoded({ extended: false }), this.authenticate.bind(this), this.validateBody.bind(this))
    this.express.use('/api', this.router)
    this.express.set('json spaces', 2)

    this.express.listen(config.web.port, () => {
      Logger.webMessage(`API online and is running on http://localhost:${config.web.port}/api/`)
    })
  }

  authenticate(request, response, next) {
    try {
      Logger.webMessage(`Incoming request from ${request.ip} to ${request.originalUrl}`)

      if (request.headers?.authorization !== config.web.token && request.query?.key !== config.web.token) {
        return response.status(401).json({
          success: false,
          reason: 'Invalid or Missing Authentication'
        })
      }

      next()
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }

  validateBody(request, response, next) {
    try {
      const path = request.path.slice(5)

      switch (path) {
        case 'setrank':
          if (this.missing(['username', 'rank'], request.body)) {
            return response.status(400).json({
              success: false,
              reason: 'Malformed Body'
            })
          }
          next()
          break

        case 'override':
          if (this.missing(['message'], request.body)) {
            return response.status(400).json({
              success: false,
              reason: 'Malformed Body'
            })
          }
          next()
          break
        case 'patchnotes':
          next()
          break
        case 'mutechat':
          next()
          break
        case 'mute':
          if (this.missing(['username', 'duration'], request.body)) {
            return response.status(400).json({
              success: false,
              reason: 'Malformed Body'
            })
          }
          break
        case 'message':
          next()
          break
        case 'command':
          next()
          break

        default:
          if (this.missing(['username'], request.body)) {
            return response.status(400).json({
              success: false,
              reason: 'Malformed Body'
            })
          }
          next()
      }
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }

  missing(array, object) {
    try {
      let missing = false

      array.forEach(element => {
        if (!object[element]) missing = true
      })

      return missing
    } catch (error) {
      return true
    }
  }

  kick(request, response) {
    try {
      if (this.app.minecraft.bot?.player) {
        this.app.minecraft.bot.chat(`/guild kick ${request.body.username} ${request.body.reason ? request.body.reason : 'No reason specified'}`)

        return response.status(200).json({
          success: true
        })
      }

      return response.status(409).json({
        success: false,
        reason: 'Minecraft client is unavailable at this time'
      })
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }

  mute(request, response) {
    try {
      if (this.app.minecraft.bot?.player) {
        this.app.minecraft.bot.chat(`/guild mute ${request.body.username}`)

        return response.status(200).json({
          success: true
        })
      }

      return response.status(409).json({
        success: false,
        reason: 'Minecraft client is unavailable at this time'
      })
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }

  unMute(request, response) {
    try {
      if (this.app.minecraft.bot?.player) {
        this.app.minecraft.bot.chat(`/guild unmute ${request.body.username}`)

        return response.status(200).json({
          success: true
        })
      }

      return response.status(409).json({
        success: false,
        reason: 'Minecraft client is unavailable at this time'
      })
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }

  promote(request, response) {
    try {
      if (this.app.minecraft.bot?.player) {
        this.app.minecraft.bot.chat(`/guild promote ${request.body.username}`)

        return response.status(200).json({
          success: true
        })
      }

      return response.status(409).json({
        success: false,
        reason: 'Minecraft client is unavailable at this time'
      })
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }
  demote(request, response) {
    try {
      if (this.app.minecraft.bot?.player) {
        this.app.minecraft.bot.chat(`/guild demote ${request.body.username}`)

        return response.status(200).json({
          success: true
        })
      }

      return response.status(409).json({
        success: false,
        reason: 'Minecraft client is unavailable at this time'
      })
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }

  override(request, response) {
    try {
      if (this.app.minecraft.bot?.player) {
        this.app.minecraft.bot.chat(request.body.message)

        return response.status(200).json({
          success: true
        })
      }

      return response.status(409).json({
        success: false,
        reason: 'Minecraft client is unavailable at this time'
      })
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }

  patchnotes(request, response) {
    try {
      if (this.app.minecraft.bot?.player) {
        this.app.minecraft.bot.chat(`/gc NEW PATCHNOTES! ${request.body.url}`)

        return response.status(200).json({
          success: true
        })
      }

      return response.status(409).json({
        success: false,
        reason: 'Minecraft client is unavailable at this time'
      })
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }

  mutechat(request, response) {
    try {
      if (this.app.minecraft.bot?.player) {
        this.app.minecraft.bot.chat(`/gc ${request.body.author}: ${request.body.message}`)
        this.app.minecraft.broadcastMessage({
          username: request.body.author,
          message: request.body.message, 
          guildRank: "BOT"
        })
        return response.status(200).json({
          success: true
        })
      }

      return response.status(409).json({
        success: false,
        reason: 'Minecraft client is unavailable at this time'
      })
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }

  invite(request, response) {
    try {

      if (this.app.minecraft.bot?.player) {
        this.app.minecraft.bot.chat(`/guild invite ${request.body.username}`)

        return response.status(200).json({
          success: true
        })
      }

      return response.status(409).json({
        success: false,
        reason: 'Minecraft client is unavailable at this time'
      })
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }

  setRank(request, response) {
    try {
      if (this.app.minecraft.bot?.player) {
        this.app.minecraft.bot.chat(`/guild setrank ${request.body.username} ${request.body.rank}`)

        return response.status(200).json({
          success: true
        })
      }

      return response.status(409).json({
        success: false,
        reason: 'Minecraft client is unavailable at this time'
      })
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An internal server error occurred'
      })
    }
  }
  //yonko made this, its probably shit
  message(request, response){
    try{
      if (this.app.minecraft.bot?.player){
        if (request.body.type == "bridge"){
            this.app.minecraft.bot.chat(`/gc ${request.body.author} [${request.body.guildRank}]: ${request.body.message} {${makeid(6)}}`)
            return response.status(200).json({
              success: true
            });
        } else if (request.body.type == "officer"){
          this.app.minecraft.bot.chat(`/oc ${request.body.author} [${request.body.guildRank}]: ${request.body.message} {${makeid(6)}}`)
          return response.status(200).json({
            success: true
          });
        } else {
          return response.status(500).json({
            success: false,
            message: "Message type was not set"
          });
        }
        
      } else {
        return response.status(500).json({
          success: false,
          message: "Aria bridge is not online."
        });
      }
    } catch (error){
      console.error("Error:", error);
      return response.status(500).json({
        success: false,
        message: "An error occurred while processing the request."
      });
    }
  }

  command(request, response) {
    try {
      console.log(request.body.message)
      this.app.minecraft.bot.chat(`${request.body.message}`)
      return response.status(200).json({
        success: true,
      })
    } catch (error) {
      this.app.log.error(error)

      return response.status(500).json({
        success: false,
        reason: 'An error occurred while processing the request.'
      })
    }
  }
}




module.exports = ExpressManager
