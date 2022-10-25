const TelegramApi = require("node-telegram-bot-api")
const express = require("express")
const cors = require("cors")


const TOKEN = "5684851368:AAHJ7FXepgYoQZnxFnlmyaHexxhdcbAqke8"

const webAppUrl = "https://tg-bot-alex-test-1-web-app.vercel.app"

const bot = new TelegramApi(TOKEN, {polling: true})
const app = express()


app.use(express.json())
app.use(cors())

const chats = {}

const startGame = async chatId => {
    const randomDigit = Math.floor(Math.random() * 10)
    chats[chatId] = randomDigit
    botLastMsg = await bot.sendMessage(chatId, "Я загадал число от 1 до 9, попробуй его отгадать", gameOptions)
}

let botLastMsg = null

const start = () => {
    bot.on("message", async msg => {
        const text = msg.text
        const chatId = msg.chat.id
        if (text === "/start") {
            await bot.sendMessage(chatId, "Сделай заказец в нашем магазе", {
                reply_markup: {
                    inline_keyboard: [
                        [{text: "Заказец", web_app: {url: webAppUrl}}]
                    ],
                }
            })
            await bot.sendMessage(chatId, "Ниже появится кнопка, заполни форму", {
                reply_markup: {
                    keyboard: [
                        [{text: "Заполнить форму", web_app: {url: webAppUrl + "/form"}}]
                    ],
                }
            })
        }

        if (msg?.web_app_data?.data) {
            try {
                const data = JSON.parse(msg?.web_app_data?.data)
                console.log(data)
                await bot.sendMessage(chatId, "Спасибо за обратную связь")
                await bot.sendMessage(chatId, "Ваша страна " + data.country)
            } catch (e) {
                console.log(e)
            }
        }
    })
}

start()

app.post("/web-data", async (req, res) => {
    console.log("WATAFAK??????")
    const {queryId, products, totalPrice} = req.body
    try {
        console.log(req)
        await bot.answerWebAppQuery(queryId, {
            type: "article",
            id: queryId,
            title: "Успешная покупка",
            input_message_content: {
                message_text: "Конгратюлэйшинс, вы потратили " + totalPrice + " деревянных"
            }
        })
        return res.status(200).json({})
    } catch (e) {
        console.log(e)
        return res.status(500).json({})
    }
})

const PORT = 8000

app.listen(process.env.PORT || PORT, () => console.log("Сервак дал газу на порту " + PORT))