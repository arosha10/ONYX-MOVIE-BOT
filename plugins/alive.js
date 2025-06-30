const {cmd , commands} = require('../command')
const config = require('../config');
cmd({
    pattern: "alive",
    react: "🌀",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
},
async(robin, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    //stick
    await robin.sendMessage(from,{sticker: { url : "https://github.com/aroshsamuditha/ONYX-MEDIA/raw/refs/heads/main/sticker/alive%20msg.webp" },package: '🌀ONYX MD🔥BY AROSH🌀'},{ quoted: mek })
    //voice
    await robin.sendPresenceUpdate('recording', from);
    await robin.sendMessage(from, { audio: { url: "https://github.com/aroshsamuditha/ONYX-MEDIA/raw/refs/heads/main/audio/alive%20onyx.MP3" }, mimetype: 'audio/mpeg', ptt: true }, { quoted: mek });
   //msg 
    return await robin.sendMessage(from,{image: {url: config.ALIVE_IMG},caption: config.ALIVE_MSG},{quoted: mek})
    
}catch(e){
console.log(e)
reply(`${e}`)
}
})

