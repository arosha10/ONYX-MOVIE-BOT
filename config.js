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
  ALIVE_IMG: process.env.ALIVE_IMG || "https://raw.githubusercontent.com/aroshsamuditha/ONYX-MEDIA/refs/heads/main/IMG/MOVIE%20BOT.jpg",
  ALIVE_MSG: process.env.ALIVE_MSG || "*🌀ONYX MOVIE BOT🎞BY AROSH🌀*/n/n--------I am alive now...!👻-------/n/n> With this ONYX MOVIE DOWNLOADER BOT you can download movies via Whatsapp 🔥▶/n> මේ ONYX MOVIE DOWNLOADER BOT මගින් ඔබට Whatsapp හරහා Movie Download කර ගැනීමෙ හැකියාව ඇත 🔥▶/n> இந்த ONYX MOVIE DOWNLOADER BOT மூலம் நீங்கள் Whatsapp வழியாக திரைப்படங்களை பதிவிறக்கம் செய்யலாம் 🔥▶/n/n✅ Github repository = https://github.com/aroshsamuditha/ONYX-MOVIE-BOT/n✅Youtube = https://www.youtube.com/@ONYXSTUDIO2005/n✅ Tiktok Page = https://www.tiktok.com/@onyxstudio_byarosh?_t=ZS-8xQGlXXfj3o&_r=1/n/n> By Arosh Samuditha",
  AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
  MODE: process.env.MODE || "public",
  MOVIE_API_KEY: process.env.MOVIE_API_KEY || "sky|704cd20313ac2a28458fb6f968ec5f6f4d6aa2f5", //https://api.skymansion.site/movies-dl/
};
