const { cmd } = require("../command");

cmd(
  {
    pattern: "owner",
    alias: ["creator", "dev"],
    desc: "Get the bot owner's contact number",
    category: "info",
    react: "👑",
    filename: __filename,
  },
  async (robin, mek, m, { reply }) => {
    try {
      const ownerJid = "94761676948@s.whatsapp.net"; // Owner's WhatsApp ID
      const vcard =
        "BEGIN:VCARD\n" +
        "VERSION:3.0\n" +
        "FN:Arosh Samuditha\n" +
        "ORG:ONYX-MD Developer\n" +
        "TEL;type=CELL;type=VOICE;waid=94761676948:+94 76 167 6948\n" +
        "END:VCARD";

      await robin.sendMessage(mek.key.remoteJid, {
        contacts: {
          displayName: "Bot Owner",
          contacts: [{ vcard }],
        },
      }, { quoted: mek });
    } catch (e) {
      console.error("OWNER COMMAND ERROR:", e);
      reply("❌ Unable to send contact.");
    }
  }
);
