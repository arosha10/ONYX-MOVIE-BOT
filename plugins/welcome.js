// Welcome plugin for new group members
// Usage: called from index.js when a new member joins

const WELCOME_STICKER = "https://github.com/aroshsamuditha/ONYX-MEDIA/raw/refs/heads/main/sticker/welcome.webp";
const WELCOME_IMAGE = "https://raw.githubusercontent.com/aroshsamuditha/ONYX-MEDIA/refs/heads/main/IMG/ONYX%20WELCOME%20GROUP.jpg";

/**
 * Sends a welcome message with image, sticker, and custom formatting.
 * @param {object} robin - The Baileys socket instance
 * @param {string} groupId - The group JID
 * @param {string[]} newMembers - Array of new member JIDs
 */
module.exports = async function (robin, groupId, newMembers) {
  try {
    // Fetch group metadata for group name
    let groupMetadata = await robin.groupMetadata(groupId);
    let groupName = groupMetadata.subject || "this group";

    for (const member of newMembers) {
      // Custom welcome message
      const caption = `👋😍 *WELCOME TO ${groupName}!*\n@${member.split("@")[0]} 👻,\n ∧,,,∧\n(  ̳• · • ̳)\n /    づ♡ I love you\n\nwe are glad to have you here!\n\n*ඔයා Movie Bot ට අලුත් කෙනෙක්ද?*\n\nමෙන්න මේ විදිහට තමා Movie Download කරගන්නෙ 👇\n\n1️⃣ ඔයාට ඕන කරන movie එකේ නම *.movie movie එකේ නම* මේ විදිහට type කරන්න.\n\n*උදාහරණ = .movie harry potter*\n\nඑතකොට ඔයාට titles එක්ක massage එකක් එයි\n\n2️⃣ දැන් ඔයාට ගන්න ඔන movie එකේ title එක ඉස්සරහ තියන අංකය .moviepick <number> මේ විදිහට type කරල send කරන්න \n*උදාහරණ = .movie 1*\n\n🌟දැන් විනාඩියක් වගේ ඇතුලත ඔයාගෙ movie එක Download වෙයි✅⚡\n\n> *🌀ONYX MD🔥BOT👾BY AROSH*`;

      // Send image with caption
      await robin.sendMessage(groupId, {
        image: { url: WELCOME_IMAGE },
        caption,
        mentions: [member],
      });

      // Send sticker
      await robin.sendMessage(groupId, {
        sticker: { url: WELCOME_STICKER },
      });
    }
  } catch (e) {
    console.log("[WELCOME PLUGIN ERROR]", e);
  }
}; 
