const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers,
} = require("@whiskeysockets/baileys");

const l = console.log;
const {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  fetchJson,
} = require("./lib/functions");
const fs = require("fs");
const P = require("pino");
const config = require("./config");
const qrcode = require("qrcode-terminal");
const util = require("util");
const { sms, downloadMediaMessage } = require("./lib/msg");
const axios = require("axios");
const { File } = require("megajs");
const prefix = config.PREFIX;
(async () => {
  const { default: fetch } = await import('node-fetch');
  globalThis.fetch = fetch;
})();

const ownerNumber = config.OWNER_NUM;

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + "/auth_info_baileys/creds.json")) {
  if (!config.SESSION_ID)
    return console.log("Please add your session to SESSION_ID env !!");
  const sessdata = config.SESSION_ID;
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
  filer.download((err, data) => {
    if (err) throw err;
    fs.writeFile(__dirname + "/auth_info_baileys/creds.json", data, () => {
      console.log("Session downloaded ✅");
    });
  });
}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

//=============================================

async function connectToWA() {
  let retryCount = 0;
  const maxRetries = 5;

  //===========================

  console.log("Connecting 🌀ONYX MD🔥BOT👾...");
  
  try {
    const { state, saveCreds } = await useMultiFileAuthState(
      __dirname + "/auth_info_baileys/"
    );
    var { version } = await fetchLatestBaileysVersion();

    const robin = makeWASocket({
      logger: P({ level: "silent" }),
      printQRInTerminal: false,
      browser: Browsers.macOS("Firefox"),
      syncFullHistory: true,
      auth: state,
      version,
      connectTimeoutMs: 60000, // 60 seconds timeout
      defaultQueryTimeoutMs: 30000, // 30 seconds for queries
      retryRequestDelayMs: 2000, // 2 seconds delay between retries
    });

      robin.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === "close") {
        if (
          lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
        ) {
          console.log("Connection closed, attempting to reconnect...");
          setTimeout(() => {
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`Reconnection attempt ${retryCount}/${maxRetries}`);
              connectToWA();
            } else {
              console.log("Max retry attempts reached. Please check your connection.");
            }
          }, 5000);
        }
      } else if (connection === "open") {
      console.log(" Installing... ");
      const path = require("path");
      fs.readdirSync("./plugins/").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
          require("./plugins/" + plugin);
        }
      });
      console.log("🌀ONYX MD🔥BOT👾 installed successful ✅");
      console.log("🌀ONYX MD🔥BOT👾 connected to whatsapp ✅");

      let up = `*🌀ONYX MD🔥BOT👾 connected successful ✅*\n\n𝙾𝚗𝚢𝚡 𝙼𝚍 𝚒𝚜 𝚊 𝚋𝚘𝚝 𝚝𝚑𝚊𝚝 𝚠𝚘𝚛𝚔𝚜 𝚘𝚗 𝚆𝚑𝚊𝚝𝚜𝚊𝚙𝚙 𝚌𝚛𝚎𝚊𝚝𝚎𝚍 𝚋𝚢 𝙰𝚛𝚘𝚜𝚑 𝚂𝚊𝚖𝚞𝚍𝚒𝚝𝚑𝚊! 𝚈𝚘𝚞 𝚌𝚊𝚗 𝚐𝚎𝚝 𝚖𝚊𝚗𝚢 𝚋𝚎𝚗𝚎𝚏𝚒𝚝𝚜 𝚏𝚛𝚘𝚖 𝚝𝚑𝚒𝚜 🤑\n\n*✅ Github repository = https://github.com/aroshsamuditha/ONYX-MD*\n*✅ Web Site =*\n*✅Youtube =*\n*✅ Tiktok Page = https://www.tiktok.com/@onyxstudio_byarosh?_t=ZS-8xQGlXXfj3o&_r=1*\n\n> By Arosh Samuditha`;
      let up1 = `*※ Hello Arosh, I made bot successful 🖤✅*`;

      robin.sendMessage(ownerNumber + "@s.whatsapp.net", {
        image: {
          url: `https://raw.githubusercontent.com/aroshsamuditha/ONYX-MEDIA/refs/heads/main/oNYX%20bOT.jpg`,
        },
        caption: up,
      });
      robin.sendMessage("94761676948@s.whatsapp.net", {
        image: {
          url: `https://raw.githubusercontent.com/aroshsamuditha/ONYX-MEDIA/refs/heads/main/oNYX%20bOT.jpg`,
        },
        caption: up1,
      });
    }
  });
  robin.ev.on("creds.update", saveCreds);
  robin.ev.on("messages.upsert", async (mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;
    mek.message =
      getContentType(mek.message) === "ephemeralMessage"
        ? mek.message.ephemeralMessage.message
        : mek.message;
    
    //status auto read
    
if (
  mek.key &&
  mek.key.remoteJid === "status@broadcast" &&
  config.AUTO_READ_STATUS === "true"
) {
  await robin.readMessages([mek.key]);
}
      
    
    const m = sms(robin, mek);
    const type = getContentType(mek.message);
    const content = JSON.stringify(mek.message);
    const from = mek.key.remoteJid;
    const quoted =
      type == "extendedTextMessage" &&
      mek.message.extendedTextMessage.contextInfo != null
        ? mek.message.extendedTextMessage.contextInfo.quotedMessage || []
        : [];
    const body =
      type === "conversation"
        ? mek.message.conversation
        : type === "extendedTextMessage"
        ? mek.message.extendedTextMessage.text
        : type == "imageMessage" && mek.message.imageMessage.caption
        ? mek.message.imageMessage.caption
        : type == "videoMessage" && mek.message.videoMessage.caption
        ? mek.message.videoMessage.caption
        : "";
    const isCmd = body.startsWith(prefix);
    const command = isCmd
      ? body.slice(prefix.length).trim().split(" ").shift().toLowerCase()
      : "";
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(" ");
    const isGroup = from.endsWith("@g.us");
    const sender = mek.key.fromMe
      ? robin.user.id.split(":")[0] + "@s.whatsapp.net" || robin.user.id
      : mek.key.participant || mek.key.remoteJid;
    const senderNumber = sender.split("@")[0];
    const botNumber = robin.user.id.split(":")[0];
    const pushname = mek.pushName || "Sin Nombre";
    const isMe = botNumber.includes(senderNumber);
    const isOwner = ownerNumber.includes(senderNumber) || isMe;
    const botNumber2 = await jidNormalizedUser(robin.user.id);
    const groupMetadata = isGroup
      ? await robin.groupMetadata(from).catch((e) => {})
      : "";
    const groupName = isGroup ? groupMetadata.subject : "";
    const participants = isGroup ? await groupMetadata.participants : "";
    const groupAdmins = isGroup ? await getGroupAdmins(participants) : "";
    const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
    const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
    const isReact = m.message.reactionMessage ? true : false;
    const reply = (teks) => {
      robin.sendMessage(from, { text: teks }, { quoted: mek });
    };

    // New user detection and auto channel/group joining
    if (!isGroup && !isCmd && body.trim()) {
      try {
        const fs = require('fs');
        const path = require('path');
        const newUsersPath = path.join(__dirname, 'data/newusers.json');
        
        // Load existing new users data with proper error handling
        let newUsers = {};
        if (fs.existsSync(newUsersPath)) {
          try {
            const fileContent = fs.readFileSync(newUsersPath, 'utf8');
            if (fileContent.trim()) {
              // Check for invalid characters and clean the content
              const cleanContent = fileContent.replace(/[^\x20-\x7E]/g, '');
              if (cleanContent.trim()) {
                newUsers = JSON.parse(cleanContent);
              }
            }
          } catch (parseError) {
            console.error("Error parsing newusers.json:", parseError.message);
            console.log("Creating fresh newusers.json file...");
            // If file is corrupted, recreate it
            try {
              fs.writeFileSync(newUsersPath, JSON.stringify({}, null, 2), 'utf8');
              console.log("Fresh newusers.json file created successfully");
            } catch (writeError) {
              console.error("Error creating fresh newusers.json:", writeError.message);
            }
            newUsers = {};
          }
        }
        
        // Check if this is a new user
        if (!newUsers[senderNumber]) {
          console.log(`New user detected: ${senderNumber}`);
          
          // Mark user as seen
          newUsers[senderNumber] = {
            firstMessage: new Date().toISOString(),
            name: pushname || "Unknown"
          };
          
          // Save updated new users data with error handling
          try {
            fs.writeFileSync(newUsersPath, JSON.stringify(newUsers, null, 2), 'utf8');
            console.log(`New user data saved for: ${senderNumber}`);
          } catch (saveError) {
            console.error("Error saving new user data:", saveError.message);
          }
          
          // Send welcome message with channel and group links
          const welcomeMsg = `🎉 *Welcome to 🌀ONYX MD🔥BOT!* 🎉

👋 *Hello ${pushname || "there"}!* 

Thank you for connecting with our bot! To stay updated and connect with our community, please:

📢 *Join our WhatsApp Channel:*
https://whatsapp.com/channel/0029VaARQM6G3R3bdsoX8U0s

👥 *Join our WhatsApp Group:*
https://chat.whatsapp.com/EakzHLdzYkn8dpflSMqYr1?mode=r_t

🔧 *Bot Commands:*
• .menu - Show all commands
• .alive - Check if bot is online
• .help - Get help

> *Made with ❤️ by Arosh Samuditha*`;

          // Send welcome message
          try {
            await robin.sendMessage(from, {
              text: welcomeMsg
            });
            console.log(`Welcome message sent to: ${senderNumber}`);
          } catch (sendError) {
            console.error("Error sending welcome message:", sendError.message);
          }
          
          // Send a follow-up message after 2 seconds
          setTimeout(async () => {
            try {
              const followUpMsg = `💡 *Quick Tips:*
• Use .menu to see all available commands
• The bot works in both inbox and groups
• Feel free to ask for help anytime!

🎯 *Don't forget to join our channel and group for updates!*`;
              
              await robin.sendMessage(from, {
                text: followUpMsg
              });
              console.log(`Follow-up message sent to: ${senderNumber}`);
            } catch (followUpError) {
              console.error("Error sending follow-up message:", followUpError.message);
            }
          }, 2000);
        }
      } catch (error) {
        console.error("New user detection error:", error.message);
      }
    }

    robin.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
      try {
        let mime = "";
        let res = await axios.head(url, { timeout: 30000 }); // 30 second timeout
        mime = res.headers["content-type"];
      if (mime.split("/")[1] === "gif") {
        return robin.sendMessage(
          jid,
          {
            video: await getBuffer(url),
            caption: caption,
            gifPlayback: true,
            ...options,
          },
          { quoted: quoted, ...options }
        );
      }
      let type = mime.split("/")[0] + "Message";
      if (mime === "application/pdf") {
        return robin.sendMessage(
          jid,
          {
            document: await getBuffer(url),
            mimetype: "application/pdf",
            caption: caption,
            ...options,
          },
          { quoted: quoted, ...options }
        );
      }
      if (mime.split("/")[0] === "image") {
        return robin.sendMessage(
          jid,
          { image: await getBuffer(url), caption: caption, ...options },
          { quoted: quoted, ...options }
        );
      }
      if (mime.split("/")[0] === "video") {
        return robin.sendMessage(
          jid,
          {
            video: await getBuffer(url),
            caption: caption,
            mimetype: "video/mp4",
            ...options,
          },
          { quoted: quoted, ...options }
        );
      }
      if (mime.split("/")[0] === "audio") {
        return robin.sendMessage(
          jid,
          {
            audio: await getBuffer(url),
            caption: caption,
            mimetype: "audio/mpeg",
            ...options,
          },
          { quoted: quoted, ...options }
        );
      }
    } catch (error) {
      console.error("sendFileUrl error:", error);
      // Send error message to user
      robin.sendMessage(jid, { 
        text: "❌ Failed to send file. Please try again later." 
      }, { quoted: quoted });
    }
  };
    // Owner react system - Integrated into index.js for better performance
    if (!isReact) { // Only react to non-reaction messages to avoid loops
      try {
        const fs = require('fs');
        const path = require('path');
        const ownerReactPath = path.join(__dirname, 'data/ownerreact.json');
        
        if (fs.existsSync(ownerReactPath)) {
          const ownerReactData = JSON.parse(fs.readFileSync(ownerReactPath, 'utf8'));
          
          // Check if sender is in owner list
          for (const owner in ownerReactData) {
            const cleanOwner = owner.replace('+', '');
            if (senderNumber === cleanOwner) {
              const emoji = ownerReactData[owner];
              console.log(`Owner react: ${senderNumber} -> ${emoji} in ${isGroup ? 'group' : 'inbox'}`);
              
              try {
                await robin.sendMessage(from, { 
                  react: { 
                    text: emoji, 
                    key: mek.key 
                  } 
                });
                console.log("✅ Owner reaction sent successfully");
              } catch (reactError) {
                console.error("❌ Failed to send owner reaction:", reactError.message);
              }
              break; // Exit after finding the owner
            }
          }
        } else {
          console.log("⚠️ Owner react data file not found at:", ownerReactPath);
        }
      } catch (error) {
        console.error("❌ Owner react error:", error.message);
      }
    }
    
    //work type
    if (!isOwner && config.MODE === "private") return;
    if (!isOwner && isGroup && config.MODE === "inbox") return;
    if (!isOwner && !isGroup && config.MODE === "groups") return;

    const events = require("./command");
    const cmdName = isCmd
      ? body.slice(1).trim().split(" ")[0].toLowerCase()
      : false;
    if (isCmd) {
      const cmd =
        events.commands.find((cmd) => cmd.pattern === cmdName) ||
        events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));
      if (cmd) {
        if (cmd.react)
          robin.sendMessage(from, { react: { text: cmd.react, key: mek.key } });

        try {
          cmd.function(robin, mek, m, {
            from,
            quoted,
            body,
            isCmd,
            command,
            args,
            q,
            isGroup,
            sender,
            senderNumber,
            botNumber2,
            botNumber,
            pushname,
            isMe,
            isOwner,
            groupMetadata,
            groupName,
            participants,
            groupAdmins,
            isBotAdmins,
            isAdmins,
            reply,
          });
        } catch (e) {
          console.error("[PLUGIN ERROR] " + e);
        }
      }
    }
    events.commands.map(async (command) => {
      if (body && command.on === "body") {
        command.function(robin, mek, m, {
          from,
          l,
          quoted,
          body,
          isCmd,
          command,
          args,
          q,
          isGroup,
          sender,
          senderNumber,
          botNumber2,
          botNumber,
          pushname,
          isMe,
          isOwner,
          groupMetadata,
          groupName,
          participants,
          groupAdmins,
          isBotAdmins,
          isAdmins,
          reply,
        });
      } else if (mek.q && command.on === "text") {
        command.function(robin, mek, m, {
          from,
          l,
          quoted,
          body,
          isCmd,
          command,
          args,
          q,
          isGroup,
          sender,
          senderNumber,
          botNumber2,
          botNumber,
          pushname,
          isMe,
          isOwner,
          groupMetadata,
          groupName,
          participants,
          groupAdmins,
          isBotAdmins,
          isAdmins,
          reply,
        });
      } else if (
        (command.on === "image" || command.on === "photo") &&
        mek.type === "imageMessage"
      ) {
        command.function(robin, mek, m, {
          from,
          l,
          quoted,
          body,
          isCmd,
          command,
          args,
          q,
          isGroup,
          sender,
          senderNumber,
          botNumber2,
          botNumber,
          pushname,
          isMe,
          isOwner,
          groupMetadata,
          groupName,
          participants,
          groupAdmins,
          isBotAdmins,
          isAdmins,
          reply,
        });
      } else if (command.on === "sticker" && mek.type === "stickerMessage") {
        command.function(robin, mek, m, {
          from,
          l,
          quoted,
          body,
          isCmd,
          command,
          args,
          q,
          isGroup,
          sender,
          senderNumber,
          botNumber2,
          botNumber,
          pushname,
          isMe,
          isOwner,
          groupMetadata,
          groupName,
          participants,
          groupAdmins,
          isBotAdmins,
          isAdmins,
          reply,
        });
      }
    });
    //============================================================================
  });
  robin.ev.on("group-participants.update", async (update) => {
    try {
      // Welcome new members
      if (update.action === "add" && update.participants && update.participants.length > 0) {
        const groupId = update.id;
        const newMembers = update.participants;
        try {
          const welcome = require("./plugins/welcome.js");
          await welcome(robin, groupId, newMembers);
        } catch (e) {
          console.log("[WELCOME PLUGIN ERROR]", e);
        }
      }
      // Goodbye to members who left
      if (update.action === "remove" && update.participants && update.participants.length > 0) {
        const groupId = update.id;
        const leftMembers = update.participants;
        try {
          const goodbye = require("./plugins/goodbye.js");
          await goodbye(robin, groupId, leftMembers);
        } catch (e) {
          console.log("[GOODBYE PLUGIN ERROR]", e);
        }
      }
    } catch (err) {
      console.log("[GROUP PARTICIPANT UPDATE ERROR]", err);
    }
  });
  
  } catch (error) {
    console.error("Connection error:", error);
    if (retryCount < maxRetries) {
      retryCount++;
      console.log(`Connection failed, retrying in 10 seconds... (${retryCount}/${maxRetries})`);
      setTimeout(() => {
        connectToWA();
      }, 10000);
    } else {
      console.log("Max connection attempts reached. Please check your internet connection and try again.");
    }
  }
}
app.get("/", (req, res) => {
  res.send("hey, 🌀ONYX MD🔥BOT👾 started✅");
});
app.listen(port, () =>
  console.log(`Server listening on port http://localhost:${port}`)
);
setTimeout(() => {
  connectToWA();
}, 4000);
