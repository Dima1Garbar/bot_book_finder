require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('1402040957:AAFaVwHOMrlAO_B_9lzlfxC_6SjutAWeMTg', {polling: true})
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false });
var status_book;
var book_name

bot.onText(/start/, (msg, match) => {
    let chatId = msg.chat.id;
    let url = match.input.split(' ')[1];
    
    tempSiteURL = url;
    bot.sendMessage(
        chatId,
        'Веберіть дію',
        {
            reply_markup: {
                inline_keyboard: [[
                    {
                        text: 'Найти книгу',
                        callback_data: 'find_a_book'
                    } 
                ]]
            }
        }
    );
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    if (query.data === 'find_a_book') {
        bot.sendMessage(chatId, "Напишіть назву книги");
        status_book = true;
    }
})

bot.on('message', (msg) => {
    let chatId = msg.chat.id;
    if (status_book === true){        
        status_book = false;
        book_name = msg.text;
        bot.sendMessage(chatId, 'Відбувається пошук, зачекайте !')
        nightmare
            .goto('https://knijky.ru/')
            .type('#search-input', book_name)
            .click("#search-submit")
            .wait(500)
            .click('span.field-content a')
            .url()
            .end()
            .then(url => {
                    bot.sendMessage(chatId, url);
            })
            .catch(error => {
                bot.sendMessage(chatId, 'Помилка пошука! Спробуйте ввести іншу книгу', error);
            })
    }
})
