const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "D9oGWTKZ#_FD3OdyM3PAicjH0DyvK4OjTnPKL35xK5V63Lr5MX9Y",
  OWNER_NUM: process.env.OWNER_NUM || "94704270689",
  PREFIX: process.env.PREFIX || ".",
  ALIVE_IMG: process.env.ALIVE_IMG || "https://raw.githubusercontent.com/aroshsamuditha/ONYX-MEDIA/refs/heads/main/oNYX%20bOT.jpg",
  ALIVE_MSG: process.env.ALIVE_MSG || "*🌀ONYX MD🔥BY AROSH🌀*\n\n--------I am alive now...!👻-------\n\n > 𝙾𝚗𝚢𝚡 𝙼𝚍 𝚒𝚜 𝚊 𝚋𝚘𝚝 𝚝𝚑𝚊𝚝 𝚠𝚘𝚛𝚔𝚜 𝚘𝚗 𝚆𝚑𝚊𝚝𝚜𝚊𝚙𝚙 𝚌𝚛𝚎𝚊𝚝𝚎𝚍 𝚋𝚢 𝙰𝚛𝚘𝚜𝚑 𝚂𝚊𝚖𝚞𝚍𝚒𝚝𝚑𝚊! 𝚈𝚘𝚞 𝚌𝚊𝚗 𝚐𝚎𝚝 𝚖𝚊𝚗𝚢 𝚋𝚎𝚗𝚎𝚏𝚒𝚝𝚜 𝚏𝚛𝚘𝚖 𝚝𝚑𝚒𝚜 🤑\n\n> Onyx Md යනු Arosh samuditha විසින් නිර්මාණය කරන ලද Whatsapp හී ක්‍රියා කරන බොට් කෙනෙකි ! මෙමගින් ඔබට නොයෙක් ආකාරයේ ප්‍රයෝජන රැසක් ලබාගත හැක 🤑\n\n> Onyx Md என்பது Arosh Samuditha அவர்களால் உருவாக்கப்பட்ட Whatsapp இல் செயல்படும் ஒரு பாட் ஆகும்! இதன் மூலம் நீங்கள் பல நன்மைகளைப் பெறலாம் 🤑\n\n*✅ Github repository = https://github.com/aroshsamuditha/ONYX-MD*\n*✅ Web Site =*\n*✅Youtube =*\n*✅ Tiktok Page = https://www.tiktok.com/@onyxstudio_byarosh?_t=ZS-8xQGlXXfj3o&_r=1*\n\n> By Arosh Samuditha",
  AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
  MODE: process.env.MODE || "public",
  AUTO_VOICE: process.env.AUTO_VOICE || "true",
  AUTO_STICKER: process.env.AUTO_STICKER || "true",
  AUTO_REPLY: process.env.AUTO_REPLY || "true",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "AIzaSyAZ9ebCV42JG8-HvCL51roj_VRo-XNXYos",
  MOVIE_API_KEY: process.env.MOVIE_API_KEY || "sky|704cd20313ac2a28458fb6f968ec5f6f4d6aa2f5", //https://api.skymansion.site/movies-dl/
};
