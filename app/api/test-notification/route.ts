import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:supermdev7@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: Request) {
  const { userId } = await request.json();

  try {
    const userDoc = await getDoc(doc(db, 'userProfiles', userId));
    const userData = userDoc.data();

    if (userData && userData.fcmToken) {
      await webpush.sendNotification(
        JSON.parse(userData.fcmToken),
        JSON.stringify({
          title: 'Test Notification',
          body: 'This is a test push notification',
          icon: '/icon.png',
        })
      );

      return NextResponse.json({ message: 'Notification sent successfully' });
    } else {
      return NextResponse.json({ error: 'User not subscribed to notifications' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error sending test notification:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}