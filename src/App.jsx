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

    setChats((prev) => {
      const existing = prev.find((c) => c.chatId === chatId);
      if (existing) {
        return prev.map((c) =>
          c.chatId === chatId
            ? { ...c, messages: [...c.messages, { text, incoming: true }] }
            : c,
        );
      }
      return [...prev, { chatId, messages: [{ text, incoming: true }] }];
    });

    // Если чат пришёл первым — делаем его активным
    setActiveChatId((current) => current ?? chatId);
  }, []);

  usePolling({
    credentials,
    onIncomingMessage: handleIncoming,
    enabled: Boolean(credentials),
  });

  // Создание нового чата
  const handleCreateChat = (chatId) => {
    setChats((prev) => {
      if (prev.find((c) => c.chatId === chatId)) return prev;
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
      <aside className="sidebar">
        <header className="sidebar__header">
          <h2>MAX Chat</h2>
          <button className="sidebar__logout" onClick={handleLogout}>
            Выйти
          </button>
        </header>

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
              <span className="chat-list__id">{c.chatId}</span>
              {c.messages.length > 0 && (
                <span className="chat-list__preview">
                  {c.messages[c.messages.length - 1].text.slice(0, 40)}
                </span>
              )}
            </li>
          ))}
          {chats.length === 0 && (
            <li className="chat-list__empty">Нет чатов. Создайте первый.</li>
          )}
        </ul>
      </aside>

      <main className="chat-area">
        {activeChat ? (
          <>
            <header className="chat-area__header">{activeChat.chatId}</header>
            <MessageList messages={activeChat.messages} />
            <MessageInput onSend={handleSend} disabled={sending} />
          </>
        ) : (
          <div className="chat-area__placeholder">
            Выберите чат или создайте новый
          </div>
        )}
      </main>
    </div>
  );
}
