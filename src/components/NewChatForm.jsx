import { Flex, IconButton, Input, Typography } from "@maxhub/max-ui";
import { useState } from "react";

function normalizeChatId(input) {
  const trimmed = input.trim();
  if (trimmed.includes("@")) return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";
  return `${digits}@c.us`;
}

export function NewChatForm({ onCreate, disabled }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = phone.trim();
    if (!trimmed || loading || disabled) return;

    setError("");
    setLoading(true);

    try {
      await onCreate(trimmed);
      setPhone("");
    } catch (err) {
      setError(err.message || "Не удалось создать чат");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="new-chat" onSubmit={handleSubmit}>
      <Flex direction="column" gap={4} style={{ flex: 1 }}>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Номер получателя"
          size="medium"
          disabled={loading || disabled}
          withClearButton
        />
        {error && (
          <Typography.Label style={{ color: "#e53935", fontSize: 12 }}>
            {error}
          </Typography.Label>
        )}
      </Flex>
      <IconButton
        type="submit"
        variant="primary"
        size="small"
        disabled={!phone.trim() || loading || disabled}
      >
        {loading ? "…" : "+"}
      </IconButton>
    </form>
  );
}
