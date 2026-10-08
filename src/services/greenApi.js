export const DEFAULT_API_URL = "https://3100.api.green-api.com";

/**
 * Отправка текстового сообщения
 * @param {{ apiUrl: string, idInstance: string, apiTokenInstance: string, chatId: string, message: string }} params
 */
export async function sendMessage({
  apiUrl,
  idInstance,
  apiTokenInstance,
  chatId,
  message,
}) {
  const url = `${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId, message }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SendMessage failed (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * Получение одного уведомления из очереди
 * @returns {Promise<{ receiptId: number, body: object } | null>}
 */
export async function receiveNotification({
  apiUrl,
  idInstance,
  apiTokenInstance,
}) {
  const url = `${apiUrl}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`ReceiveNotification failed (${response.status})`);
  }

  const text = await response.text();
  if (!text || text === "null") return null;

  return JSON.parse(text);
}

/**
 * Удаление обработанного уведомления из очереди
 */
export async function deleteNotification({
  apiUrl,
  idInstance,
  apiTokenInstance,
  receiptId,
}) {
  const url = `${apiUrl}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;
  const response = await fetch(url, { method: "DELETE" });

  if (!response.ok) {
    throw new Error(`DeleteNotification failed (${response.status})`);
  }

  return response.json();
}
