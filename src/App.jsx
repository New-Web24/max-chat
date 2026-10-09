import { Button, Flex, Panel, Typography } from "@maxhub/max-ui";
import { useCallback, useState } from "react";
import { AuthForm } from "./components/AuthForm";
import { MessageInput } from "./components/MessageInput";
import { MessageList } from "./components/MessageList";
import { NewChatForm } from "./components/NewChatForm";
import { usePolling } from "./hooks/usePolling";
import { sendMessage } from "./services/greenApi";
export default function App() {
  const [credentials, setCredentials] = useState(null);
  const [chats, setChats] = useState([]); // [{ chatId, messages: [{text, incoming}] }]
  const [activeChatId, setActiveChatId] = useState(null);
  const [sending, setSending] = useState(false);

  const activeChat = chats.find((c) => c.chatId === activeChatId) ?? null;

  // Обработка входящих сообщений из поллинга
  const handleIncoming = useCallback(({ chatId, text }) => {
    if (!chatId || !text) return;

    const normalizedChatId = String(chatId);

    setChats((prev) => {
      const existing = prev.find(
        (chat) => String(chat.chatId) === normalizedChatId,
      );

      if (existing) {
        return prev.map((chat) =>
          String(chat.chatId) === normalizedChatId
            ? {
                ...chat,
                messages: [...chat.messages, { text, incoming: true }],
              }
            : chat,
        );
      }

      return [
        ...prev,
        {
          chatId: normalizedChatId,
          messages: [{ text, incoming: true }],
        },
      ];
    });

    setActiveChatId((current) => current ?? normalizedChatId);
  }, []);

  usePolling({
    credentials,
    onIncomingMessage: handleIncoming,
    enabled: Boolean(credentials),
  });

  // Создание нового чата
  const handleCreateChat = async (chatIdInput) => {
    if (!credentials) {
      throw new Error("Нет авторизации");
    }

    const chatId = chatIdInput.trim();

    if (!chatId) {
      throw new Error("Укажите номер телефона или ID чата");
    }

    setChats((prev) => {
      if (prev.some((chat) => chat.chatId === chatId)) {
        return prev;
      }

      return [...prev, { chatId, messages: [] }];
    });

    setActiveChatId(chatId);
  };

  // Отправка сообщения
  const handleSend = async (text) => {
    if (!activeChatId || !credentials) return;

    setSending(true);
    try {
      await sendMessage({
        ...credentials,
        chatId: activeChatId,
        message: text,
      });

      setChats((prev) =>
        prev.map((c) =>
          c.chatId === activeChatId
            ? { ...c, messages: [...c.messages, { text, incoming: false }] }
            : c,
        ),
      );
    } catch (err) {
      console.error("[sendMessage] error:", err);
      alert(`Не удалось отправить сообщение:\n${err.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleLogout = () => {
    setCredentials(null);
    setChats([]);
    setActiveChatId(null);
  };

  if (!credentials) {
    return <AuthForm onAuth={setCredentials} />;
  }

  return (
    <div className="app">
      <Panel mode="secondary" className="sidebar">
        <Flex
          align="center"
          justify="space-between"
          className="sidebar__header"
        >
          <Typography.Title>MAX Chat</Typography.Title>
          <Button variant="ghost" size="small" onClick={handleLogout}>
            Выйти
          </Button>
        </Flex>

        <NewChatForm onCreate={handleCreateChat} />

        <ul className="chat-list">
          {chats.map((c) => (
            <li
              key={c.chatId}
              className={`chat-list__item ${
                c.chatId === activeChatId ? "chat-list__item--active" : ""
              }`}
              onClick={() => setActiveChatId(c.chatId)}
            >
              <Typography.Label>{c.chatId}</Typography.Label>
              {c.messages.length > 0 && (
                <Typography.Label style={{ fontSize: 13, opacity: 0.6 }}>
                  {c.messages[c.messages.length - 1].text.slice(0, 40)}
                </Typography.Label>
              )}
            </li>
          ))}
          {chats.length === 0 && (
            <li className="chat-list__empty">
              <Typography.Label style={{ opacity: 0.6 }}>
                Нет чатов. Создайте первый.
              </Typography.Label>
            </li>
          )}
        </ul>
      </Panel>

      <main className="chat-area">
        {activeChat ? (
          <>
            <Flex align="center" className="chat-area__header">
              <Typography.Label>{activeChat.chatId}</Typography.Label>
            </Flex>
            <MessageList messages={activeChat.messages} />
            <MessageInput onSend={handleSend} disabled={sending} />
          </>
        ) : (
          <div className="chat-area__placeholder">
            <Typography.Label style={{ opacity: 0.6 }}>
              Выберите чат или создайте новый
            </Typography.Label>
          </div>
        )}
      </main>
    </div>
  );
}
