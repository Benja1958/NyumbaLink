"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Conversation,
  getConversations,
  MESSAGE_POLL_INTERVAL,
} from "@/lib/messages";

type UseUnreadMessagesOptions = {
  enabled: boolean;
};

export function useUnreadMessages({
  enabled,
}: UseUnreadMessagesOptions) {
  const [unreadCount, setUnreadCount] =
    useState(0);

  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission | "unsupported">(
      "unsupported"
    );

  const previousUnreadCount =
    useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if ("Notification" in window) {
      setNotificationPermission(
        Notification.permission
      );
    }
  }, []);

  const playNotificationSound =
    useCallback(() => {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext?: typeof AudioContext;
            }
          ).webkitAudioContext;

        if (!AudioContextClass) {
          return;
        }

        const context =
          new AudioContextClass();

        const oscillator =
          context.createOscillator();

        const gain =
          context.createGain();

        oscillator.connect(gain);
        gain.connect(context.destination);

        oscillator.frequency.value = 740;

        gain.gain.setValueAtTime(
          0.08,
          context.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
          0.001,
          context.currentTime + 0.18
        );

        oscillator.start();

        oscillator.stop(
          context.currentTime + 0.18
        );
      } catch {
        // Sound is optional.
      }
    }, []);

  const showBrowserNotification =
    useCallback(
      (conversation?: Conversation) => {
        if (
          typeof window === "undefined" ||
          !("Notification" in window) ||
          Notification.permission !== "granted"
        ) {
          return;
        }

        const latestMessage =
          conversation?.latest_message;

        const title = conversation
          ? conversation.listing.title
          : "New NyumbaLink message";

        const body = latestMessage
          ? latestMessage.content
          : "You have a new message.";

        new Notification(title, {
          body,
          tag: conversation
            ? `conversation-${conversation.id}`
            : "nyumbalink-message",
        });
      },
      []
    );

  const loadUnreadMessages =
    useCallback(async () => {
      if (!enabled) {
        setUnreadCount(0);
        return;
      }

      try {
        const conversations =
          await getConversations();

        const totalUnread =
          conversations.reduce(
            (total, conversation) =>
              total +
              conversation.unread_count,
            0
          );

        // Don't notify immediately when the
        // page first loads with existing unread messages.
        if (
          previousUnreadCount.current !== null &&
          totalUnread >
            previousUnreadCount.current
        ) {
          const newestUnreadConversation =
            conversations.find(
              (conversation) =>
                conversation.unread_count > 0
            );

          playNotificationSound();

          // Desktop notification is useful mainly
          // when NyumbaLink isn't the active tab.
          if (document.hidden) {
            showBrowserNotification(
              newestUnreadConversation
            );
          }
        }

        previousUnreadCount.current =
          totalUnread;

        setUnreadCount(totalUnread);
      } catch {
        // Navbar notifications shouldn't break
        // the rest of the application.
      }
    }, [
      enabled,
      playNotificationSound,
      showBrowserNotification,
    ]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    loadUnreadMessages();

    const interval = setInterval(
      loadUnreadMessages,
      MESSAGE_POLL_INTERVAL
    );

    return () => {
      clearInterval(interval);
    };
  }, [
    enabled,
    loadUnreadMessages,
  ]);

  async function enableNotifications() {
    if (
      typeof window === "undefined" ||
      !("Notification" in window)
    ) {
      setNotificationPermission(
        "unsupported"
      );
      return;
    }

    const permission =
      await Notification.requestPermission();

    setNotificationPermission(
      permission
    );
  }

  return {
    unreadCount,
    notificationPermission,
    enableNotifications,
    refreshUnreadCount:
      loadUnreadMessages,
  };
}