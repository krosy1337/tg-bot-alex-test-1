const TelegramApi = require("node-telegram-bot-api")
const {gameOptions, againOptions} = require("./options")

const TOKEN = "5684851368:AAHJ7FXepgYoQZnxFnlmyaHexxhdcbAqke8"

const bot = new TelegramApi(TOKEN, {polling: true})


const chats = {}

const startGame = async chatId => {
    const randomDigit = Math.floor(Math.random()*10)
    chats[chatId] = randomDigit
    await bot.sendMessage(chatId, "Я загадал число от 1 до 9, попробуй его отгадать", gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: "/start", description: "Старт"},
        {command: "/info", description: "Инфо эбаут ботик"},
        {command: "/game", description: "Начать игру: \"Угадай цифру\""},
    ])

    bot.on("message", async msg => {
        const text = msg.text
        const chatId = msg.chat.id
        if (text === "/start") {
            return bot.sendSticker(chatId, "CAACAgIAAxkBAAEGD1ZjRVnrlaHr2-zua7C3Df3GiISS7wACGyIAAgtu6EkU-a0BH7uXiCoE")
        }
        if (text === "/info") {
            return bot.sendMessage(chatId, "Ama bot")
        }
        if (text === "/game") {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, "IDK")
    })
    bot.on("callback_query", async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        console.log(data, chats[chatId])
        if (data === "/again") {
            return startGame(chatId)
        }
        if (parseInt(data) === chats[chatId]) {
            await bot.sendMessage(chatId, "Ты угадал, поздравляю")
            return bot.sendSticker(chatId, "CAACAgIAAxkBAAEGD2tjRWHqnw9p-Yu4AAGS_hIPLX2SOnAAAiAgAAJ1zeFJVRXAe8v35RMqBA", againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал число ${chats[chatId]}`, againOptions)
        }
    })
}

start()