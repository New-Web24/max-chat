import { Button, Flex, Input } from "@maxhub/max-ui";
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
      <Flex gap={10} align="center" style={{ width: "100%" }}>
        <div style={{ flex: 1 }}>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите сообщение..."
            size="medium"
            disabled={disabled}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="small"
          disabled={disabled || !text.trim()}
        >
          Отправить
        </Button>
      </Flex>
    </form>
  );
}
