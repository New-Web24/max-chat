import { useState } from "react";

const DEFAULT_API_URL = "https://3100.api.green-api.com";

export function AuthForm({ onAuth }) {
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedApiUrl = apiUrl.trim().replace(/\/$/, ""); // убираем слэш в конце
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
    <div className="auth-screen">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>MAX Chat</h1>
        <p className="auth-form__hint">
          Введите данные из личного кабинета GREEN-API
        </p>

        <label className="auth-form__field">
          <span>API URL</span>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="https://3100.api.green-api.com"
            autoComplete="off"
          />
        </label>

        <label className="auth-form__field">
          <span>idInstance</span>
          <input
            type="text"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            placeholder="310022760231"
            autoComplete="off"
          />
        </label>

        <label className="auth-form__field">
          <span>apiTokenInstance</span>
          <input
            type="password"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            placeholder="Вставьте токен"
            autoComplete="off"
          />
        </label>

        {error && <p className="auth-form__error">{error}</p>}

        <button type="submit">Подключиться</button>
      </form>
    </div>
  );
}
