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

        if (!notification) {
          return;
        }

        const { receiptId, body } = notification;

        console.log("[Webhook]", body?.typeWebhook, body);

        if (body?.typeWebhook === "incomingMessageReceived") {
          const chatId = body.senderData?.chatId;
          const text = body.messageData?.textMessageData?.textMessage;

          if (chatId && text) {
            onMessageRef.current?.({
              chatId: String(chatId),
              text,
            });
          }
        }

        try {
          await deleteNotification({
            ...credentials,
            receiptId,
          });
        } catch (error) {
          console.error(
            "[DeleteNotification] Не удалось удалить уведомление:",
            error,
          );
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
