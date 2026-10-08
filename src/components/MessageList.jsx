import { useEffect, useRef } from "react";

export function MessageList({ messages }) {
  const bottomRef = useRef(null);

  // Автопрокрутка вниз при появлении новых сообщений
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages.length) {
    return (
      <div className="message-list message-list--empty">
        <p>Нет сообщений. Напишите первым!</p>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`message ${msg.incoming ? "message--in" : "message--out"}`}
        >
          {msg.text}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
