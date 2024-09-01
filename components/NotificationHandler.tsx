'use client'

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

export default function NotificationHandler() {
  const { user } = useUser();

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window && user) {
      registerServiceWorker();
    }
  }, [user]);

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      if (user) {
        await setDoc(doc(db, 'userProfiles', user.id), {
          fcmToken: JSON.stringify(subscription),
        }, { merge: true });
      }
    } catch (error) {
      console.error('Failed to register service worker or subscribe to push:', error);
    }
  }

  return null;
}