'use client'

import { useUser } from '@clerk/nextjs';

export default function TestNotificationButton() {
  const { user } = useUser();

  async function sendTestNotification() {
    if (user) {
      try {
        const response = await fetch('/api/test-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });

        if (response.ok) {
          console.log('Test notification sent');
        } else {
          console.error('Failed to send test notification');
        }
      } catch (error) {
        console.error('Error sending test notification:', error);
      }
    }
  }

  return (
    <button onClick={sendTestNotification}>
      Send Test Notification
    </button>
  );
}