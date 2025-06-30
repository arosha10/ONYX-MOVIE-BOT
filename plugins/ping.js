const config = require('../config')
const {cmd , commands} = require('../command')
const {sleep} = require('../lib/functions')

// Define the ping command
cmd({
    pattern: "ping",
    desc: "Check bot's response time.",
    category: "main",
    react: "✅",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Start timer to calculate ping
        const startTime = Date.now()

        // Send initial message
        const message = await conn.sendMessage(from, { text: '> *🌀ONYX MD🔥 Checking ping...*' })

        // End timer and calculate ping
        const endTime = Date.now()
        const ping = endTime - startTime

        // Channel information text
        const channelInfo = `
         *🌀ONYX MD🔥* : ${ping}ms
          Follow us our page 👽
        `;

        // Send the ping result along with the channel info
        await conn.sendMessage(
            from,
            {
                text: channelInfo,
                contextInfo: {
                    externalAdReply: {
                        title: "ONYX STUDIO",
                        body: "*🌀ONYX MD🔥BY AROSH SAMUDITHA*",
                        thumbnail: { url: "https://raw.githubusercontent.com/aroshsamuditha/ONYX-MEDIA/refs/heads/main/wall%20paper.png" },
                        sourceUrl: "https://www.tiktok.com/@onyxstudio_byarosh?_t=ZS-8xQGlXXfj3o&_r=1",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            },
            { quoted: message }
        );
    } catch (e) {
        // Log any errors to the console and reply with error message
        console.log(e)
        reply(`Error: ${e.message}`)
    }
});
