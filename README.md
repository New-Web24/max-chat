# MAX Chat

Тестовое задание: веб-интерфейс для отправки и получения текстовых сообщений
в мессенджере MAX через [GREEN-API](https://green-api.com/max).

## Демо

- **Стек**: React 18 + Vite + [MAX UI](https://dev.max.ru/ui)
- **API**: GREEN-API v3 (MAX)

## Возможности

- Авторизация по `apiUrl` / `idInstance` / `apiTokenInstance`
- Создание чата по номеру телефона с резолвом `chatId` через `CheckAccount`
- Отправка текстовых сообщений (`SendMessage`)
- Приём входящих сообщений через HTTP API (`ReceiveNotification` + `DeleteNotification`)
- Интерфейс на компонентах MAX UI
- Сохранение credentials в `localStorage`

## Запуск

```bash
npm install
npm run dev
```

Открой http://localhost:5173

## Настройка инстанса GREEN-API

Перед использованием убедись, что в личном кабинете GREEN-API:

- `webhookUrl` — **пустой** (иначе уведомления уходят на вебхук, а не в HTTP API)
- `incomingWebhook` — **включён**

## Архитектура

```
src/
├── components/    # UI-компоненты (AuthForm, ChatList, MessageList, MessageInput, NewChatForm)
├── hooks/         # usePolling — опрос входящих сообщений
├── services/      # greenApi — обёртка над REST API GREEN-API
├── img/           # Фоновые изображения
├── App.jsx        # Состояние чатов и логика
└── main.jsx       # Провайдер MAX UI + рендер
```

## Ограничения

- Только текстовые сообщения
- Поллинг входящих раз в 2.5 секунды (HTTP API, без webhook)
- Credentials хранятся в `localStorage`
