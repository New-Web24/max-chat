import { useState } from "react";

export function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Введите сообщение..."
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !text.trim()}>
        Отправить
      </button>
    </form>
  );
}
