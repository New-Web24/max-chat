import { useState } from "react";
import { AuthForm } from "./components/AuthForm";

export default function App() {
  const [credentials, setCredentials] = useState(null);

  if (!credentials) {
    return <AuthForm onAuth={setCredentials} />;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Авторизован</h1>
      <pre>
        {JSON.stringify({ ...credentials, apiTokenInstance: "***" }, null, 2)}
      </pre>
      <button onClick={() => setCredentials(null)}>Выйти</button>
    </div>
  );
}
