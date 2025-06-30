


const { cmd, commands } = require('../command')
const config = require('../config');

cmd(
  {
    pattern: "menu",
    alise: ["getmenu"],
    react: "👾",
    desc: "get cmd list",
    category: "main",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    {
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
    }
  ) => {
    try {
      let menu = {
        main: '',
        download: '',
        group: '',
        owner: '',
        convert: '',
        search: '',
      };

      for (let i = 0; i < commands.length; i++) {
        if (commands[i].pattern && !commands[i].dontAddCommandList) {
          menu[
            commands[i].category
          ] += `${config.PREFIX}${commands[i].pattern}\n`;
        }
      }

      let madeMenu = `👋 *Hello  ${pushname}*
      *🩵WELCOME TO🌀ONYX MD🔥*
> *Made By - Mr.Arosh Samuditha*

-----බොට් ගේ Main menu list එක පහතින් දැක්වේ 👇----

*|🔥MAIN COMMANDS🔥|*
    ▫️.alive
    ▫️.menu
    ▫️.system
    ▫️.ping
    ▫️.owner
*|🔃DOWNLOAD COMMANDS🔃|*
    ▫️.song <text>
    ▫️.video <text>
    ▫️.fb <link>
    ▫️.tt <link>
    ▫️.ig <link>
    ▫️.movie <text>
    ▫️.film <text>
*|👥GROUP COMMANDS👥|*
    ▫️kick
    ▫️remove
    ▫️leave
    ▫️mute
    ▫️unmute
    ▫️add
    ▫️demote
    ▫️promote
*|🤴🏻OWNER COMMANDS🤴🏻|*
    ▫️.restart
    ▫️.update
    ▫️.block
    ▫️.owner
    ▫️.hack
    ▫️.antispam
    ▫️.broadcast
    ▫️.clearchat
    ▫️.left
*|🔄CONVERT COMMANDS🔄|*
    ▫️.sticker <reply img>
    ▫️.toimg <reply sticker>
    ▫️.tr <lang><text>
    ▫️.tts <text>
*|🔍SEARCH COMMANDS🔍|*
    ▫️.yts <text>
    ▫️.lc
    ▫️.news
    ▫️.lankanews
    ▫️.ai <text>
    ▫️.chatgpt <text>
    ▫️.gemini <text>

> *🌀ONYX MD🔥BOT👾*
`;
      await robin.sendMessage(
        from,
        {
          image: {
            url: "https://raw.githubusercontent.com/aroshsamuditha/ONYX-MEDIA/refs/heads/main/oNYX%20bOT.jpg",
          },
          caption: madeMenu,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.log(e);
      reply(`${e}`);
    }
  }
);
