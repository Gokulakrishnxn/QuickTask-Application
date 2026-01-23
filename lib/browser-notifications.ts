// Safe helpers for using the Browser Notifications API in client components.

export async function requestBrowserNotificationPermission(): Promise<
  NotificationPermission | "unsupported"
> {
  if (typeof window === "undefined" || typeof Notification === "undefined") {
    return "unsupported"
  }

  if (Notification.permission === "granted") {
    return "granted"
  }

  if (Notification.permission === "denied") {
    return "denied"
  }

  return await Notification.requestPermission()
}

export function showBrowserNotification(
  title: string,
  options?: NotificationOptions
): void {
  if (typeof window === "undefined" || typeof Notification === "undefined") {
    return
  }

  if (Notification.permission !== "granted") {
    return
  }

  try {
    // Trigger a simple notification; callers can pass any extra options they need.
    new Notification(title, options)
  } catch (error) {
    console.error("Failed to show browser notification:", error)
  }
}

