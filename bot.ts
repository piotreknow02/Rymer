import { startBot } from "https://deno.land/x/discordeno/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { cheerio } from "https://deno.land/x/cheerio@1.0.2/mod.ts";

const BOT_PREFIX = "!rymuj";
const MESSAGE_MAX_LEN = 2000;

startBot({
  token: Deno.env.get("BOT_KEY") || config()["BOT_KEY"],
  intents: ["GUILDS", "GUILD_MESSAGES"],
  eventHandlers: {
    ready() {
      console.log("Rymer is running...");
    },
    messageCreate(message) {
      // console.log(`message: "${message.content}" received!`);
      const msg = message.content.split(" ");
      if (msg[0] !== BOT_PREFIX) return;
      scrapeRymes(msg[1]).then((value) => {
        console.log("sending...");
        if (value == null || value == undefined || value.trim() == "")
        message.reply(`Nie znaleziono rymów dla "${msg[1]}"`);
        if (value.length > MESSAGE_MAX_LEN) 
        {
          let currentSet = ""
          for (let n = 0; n < value.length; n++)
          {
            currentSet += value[n];
            if(currentSet.length == MESSAGE_MAX_LEN)
            {
              while (value[n] != " ")
              {
                n--; 
                currentSet = currentSet.substring(0, currentSet.length - 1)
              }
              message.reply(currentSet);
              currentSet = "";
            }
            if(n == value.length - 1)
            {
              message.reply(currentSet);
              currentSet = "";
            }
          }
        }
        else message.reply(value);
        console.log(value.length);
      });
    },
  },
});

async function scrapeRymes(word: string) {
  console.log("scraping rymes...");
  const url = encodeURI("https://www.rymy.eu/rymy/" + word.toLocaleLowerCase()
    .replaceAll("ą", "a")
    .replaceAll("ę", "e")
    .replaceAll("ć", "c")
    .replaceAll("ó", "o")
    .replaceAll("ń", "n")
    .replaceAll("ł", "l")
    .replaceAll("ż", "z")
    .replaceAll("ź", "z")
  );
  const data = await fetch(url);
  console.log("processing...");
  const $ = cheerio.load(await data.text());
  return $("#column-middle > div.mobile-hide > div").text();
}
