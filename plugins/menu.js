


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
      *🩵WELCOME TO🌀ONYX MOVIE🎞*
> *Made By - Mr.Arosh Samuditha*

-----බොට් ගේ Main menu list එක පහතින් දැක්වේ 👇----

*|🔥MAIN COMMANDS🔥|*
    ▫️.alive
    ▫️.menu
    ▫️.system
    ▫️.ping
    ▫️.owner
*|🎞MOVIE DOWNLOAD🎞|*
    ▫️.movie <text>
    ▫️.moviepick <number>
*|🤴🏻OWNER COMMANDS🤴🏻|*
    ▫️.restart
    ▫️.update
    ▫️.owner

*ඔයා Movie Bot ට අලුත් කෙනෙක්ද?*

මෙන්න මේ විදිහට තමා Movie Download කරගන්නෙ 👇

1️⃣ ඔයාට ඕන කරන movie එකේ නම *.movie movie එකේ නම* මේ විදිහට type කරන්න.

*උදාහරණ = .movie harry potter*

එතකොට ඔයාට titles එක්ක massage එකක් එයි

2️⃣ දැන් ඔයාට ගන්න ඔන movie එකේ title එක ඉස්සරහ තියන අංකය .moviepick <number> මේ විදිහට type කරල send කරන්න
*උදාහරණ = .movie 1*

🌟දැන් විනාඩියක් වගේ ඇතුලත ඔයාගෙ movie එක Download වෙයි✅⚡"

> *🌀ONYX MOVIE🎞BOT👾*
`;
      await robin.sendMessage(
        from,
        {
          image: {
            url: "https://raw.githubusercontent.com/aroshsamuditha/ONYX-MEDIA/refs/heads/main/IMG/MOVIE%20BOT.jpg",
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
