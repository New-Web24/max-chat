import { Button, Flex, Input, Panel, Typography } from "@maxhub/max-ui";
import { useState } from "react";

const DEFAULT_API_URL = "https://3100.api.green-api.com";

export function AuthForm({ onAuth }) {
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedApiUrl = apiUrl.trim().replace(/\/$/, "");
    const trimmedId = idInstance.trim();
    const trimmedToken = apiTokenInstance.trim();

    if (!trimmedApiUrl || !trimmedId || !trimmedToken) {
      setError("Заполните все поля");
      return;
    }

    setError("");
    onAuth({
      apiUrl: trimmedApiUrl,
      idInstance: trimmedId,
      apiTokenInstance: trimmedToken,
    });
  };

  return (
    <Flex
      align="center"
      justify="center"
      style={{
        height: "100vh",
        padding: 20,
        background: "var(--vkui--color_background_secondary, #f5f6f8)",
      }}
    >
      <Panel
        mode="primary"
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 32,
          borderRadius: 16,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap={20}>
            <Flex direction="column" gap={4} align="center">
              <Typography.Title>MAX Chat</Typography.Title>
              <Typography.Label>
                Введите данные из личного кабинета GREEN-API
              </Typography.Label>
            </Flex>

            <Flex direction="column" gap={4}>
              <Typography.Label>API URL</Typography.Label>
              <Input
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://3100.api.green-api.com"
                size="medium"
              />
            </Flex>

            <Flex direction="column" gap={4}>
              <Typography.Label>idInstance</Typography.Label>
              <Input
                value={idInstance}
                onChange={(e) => setIdInstance(e.target.value)}
                placeholder="310022760231"
                size="medium"
              />
            </Flex>

            <Flex direction="column" gap={4}>
              <Typography.Label>apiTokenInstance</Typography.Label>
              <Input
                type="password"
                value={apiTokenInstance}
                onChange={(e) => setApiTokenInstance(e.target.value)}
                placeholder="Вставьте токен"
                size="medium"
              />
            </Flex>

            {error && (
              <Typography.Label style={{ color: "#e53935" }}>
                {error}
              </Typography.Label>
            )}

            <Button type="submit" variant="primary" size="large" stretched>
              Подключиться
            </Button>
          </Flex>
        </form>
      </Panel>
    </Flex>
  );
}
