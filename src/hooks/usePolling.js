import { useEffect, useRef } from "react";
import { deleteNotification, receiveNotification } from "../services/greenApi";

const POLL_INTERVAL_MS = 2500;

/**
 * Периодически опрашивает GREEN-API на предмет новых сообщений.
 */
export function usePolling({ credentials, onIncomingMessage, enabled }) {
  const onMessageRef = useRef(onIncomingMessage);

  useEffect(() => {
    onMessageRef.current = onIncomingMessage;
  }, [onIncomingMessage]);

  useEffect(() => {
    if (!enabled || !credentials) return;

    let cancelled = false;
    let timerId = null;

    const poll = async () => {
      if (cancelled) return;

      try {
        const notification = await receiveNotification(credentials);

        if (notification && notification.body) {
          const { typeWebhook, messageData } = notification.body;

          // Только входящие текстовые сообщения
          if (
            typeWebhook === "incomingMessageReceived" &&
            messageData?.typeMessage === "textMessage"
          ) {
            onMessageRef.current?.({
              chatId: messageData.senderData?.chatId,
              text: messageData.textMessageData?.textMessage ?? "",
            });
          }

          // Подтверждаем обработку (обязательно, иначе очередь забьётся)
          await deleteNotification({
            ...credentials,
            receiptId: notification.receiptId,
          });
        }
      } catch (err) {
        console.error("[usePolling] error:", err);
      }

      if (!cancelled) {
        timerId = setTimeout(poll, POLL_INTERVAL_MS);
      }
    };

    poll();

    return () => {
      cancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, [credentials, enabled]);
}
