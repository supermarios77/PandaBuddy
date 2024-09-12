// /api/send-notification.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:supermdev7@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST() {
  try {
    const usersRef = collection(db, 'userProfiles');
    const q = query(usersRef, where('notifications', '==', true));
    const querySnapshot = await getDocs(q);

    const notificationPromises = querySnapshot.docs.map(async (doc) => {
      const user = doc.data();
      if (user.fcmToken) {
        try {
          await webpush.sendNotification(
            JSON.parse(user.fcmToken),
            JSON.stringify({
              title: 'Time to Study!',
              body: 'Your daily reminder to continue your learning journey.',
              icon: '/images/icon.png',
            })
          );
        } catch (error) {
          console.error('Error sending notification to user:', doc.id, error);
        }
      }
    });

    await Promise.all(notificationPromises);

    return NextResponse.json({ message: 'Notifications sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending notifications:', error);
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
  }
}
