const config = require('../config')
const {cmd , commands} = require('../command')
const {sleep} = require('../lib/functions')

cmd({
    pattern: "tagall",
    alias: ["mentionall", "everyone"],
    desc: "Mention all members in the group line by line with a custom message.",
    category: "main",
    filename: __filename
}, 
async (robin, mek, m, { from, isGroup, participants, text, reply }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("⚠️ This command can only be used in a group!");

        // Get the custom message (if provided)
        let tagMessage = text || "\n> *🌀ONYX MD🔥*\n👥 *Mentioning All Members:*";

        // Get all members
        let members = participants.map(u => u.id);

        // Create mention message with the custom message at the top
        let message = `📢 *${tagMessage}*\n\n`;
        message += members.map(m => `@${m.split('@')[0]}`).join('\n');

        // Send the message with mentions
        await robin.sendMessage(from, { text: message, mentions: members });

        console.log(`✅ Tagall command used in: ${from}`);
    } catch (e) {
        console.error("Tagall Error:", e);
        reply(`❌ Failed to tag all members. Error: ${e.message}`);
    }
});
