import { useState } from "react";

function normalizeChatId(input) {
  const trimmed = input.trim();
  if (trimmed.includes("@")) return trimmed;

  // Убираем всё, кроме цифр
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";

  return `${digits}@c.us`;
}

export function NewChatForm({ onCreate }) {
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const chatId = normalizeChatId(phone);
    if (!chatId) return;
    onCreate(chatId);
    setPhone("");
  };

  return (
    <form className="new-chat" onSubmit={handleSubmit}>
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Номер получателя"
      />
      <button type="submit" disabled={!phone.trim()}>
        +
      </button>
    </form>
  );
}
