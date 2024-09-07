'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'
import { motion } from 'framer-motion'
import { Shield, Check, X } from 'lucide-react'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function ParentalConsent() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userProfile, setUserProfile] = useState(null)
  const [allowVoiceChat, setAllowVoiceChat] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setError('Invalid user ID')
        setLoading(false)
        return
      }

      try {
        const userDoc = await getDoc(doc(db, 'userProfiles', userId))
        if (userDoc.exists()) {
          setUserProfile(userDoc.data())
          setAllowVoiceChat(userDoc.data().allowVoiceChat || false)
        } else {
          setError('User profile not found')
        }
      } catch (err) {
        setError('Error fetching user profile')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [userId])

  const handleConsent = async (consent: boolean) => {
    if (!userId) return

    try {
      await updateDoc(doc(db, 'userProfiles', userId), {
        parentalConsent: consent,
        allowVoiceChat: consent ? allowVoiceChat : false,
      })
      setConsentGiven(true)
    } catch (err) {
      setError('Error updating consent')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <Shield className="mr-2 text-blue-500" />
            Parental Consent
          </CardTitle>
          <CardDescription>
            Please review and provide consent for your child's use of Panda Buddy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {consentGiven ? (
            <Alert>
              <Check className="h-4 w-4" />
              <AlertTitle>Thank you!</AlertTitle>
              <AlertDescription>
                Your consent has been recorded. You can close this window now.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <p>
                Your child, {userProfile?.name}, would like to use Panda Buddy, an educational
                platform designed to make learning fun and engaging.
              </p>
              <p>
                By giving consent, you allow your child to access age-appropriate content and
                features on Panda Buddy. You can manage your child's account settings at any time.
              </p>
              <div className="flex items-center space-x-2">
                <Switch
                  id="voice-chat"
                  checked={allowVoiceChat}
                  onCheckedChange={setAllowVoiceChat}
                />
                <Label htmlFor="voice-chat">Allow voice chat features</Label>
              </div>
            </>
          )}
        </CardContent>
        {!consentGiven && (
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => handleConsent(false)}>
              <X className="mr-2 h-4 w-4" /> Deny Consent
            </Button>
            <Button onClick={() => handleConsent(true)}>
              <Check className="mr-2 h-4 w-4" /> Give Consent
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}