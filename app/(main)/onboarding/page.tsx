'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import { DotLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { setDoc, doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { BookOpen, Target, ChevronRight, ChevronLeft, Star, Brain, User, Shield, Mail, Check } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import PandaAnimation from "../(home)/Animations/PandaInUFO.json";
import CelebrationAnimation from "@/public/Welldone.json";

import { db } from "@/lib/firebaseConfig";
import { sendConsentEmail } from "@/actions/email";

const steps = [
  { id: 1, name: "Your Info", icon: User },
  { id: 2, name: "Age Verification", icon: Shield },
  { id: 3, name: "Choose Interests", icon: BookOpen },
  { id: 4, name: "Set Goals", icon: Target },
  { id: 5, name: "Learning Preferences", icon: Brain },
];

const interestAreas = [
  { name: "Mathematics", icon: "🧮", color: "from-blue-400 to-blue-600" },
  { name: "Science", icon: "🔬", color: "from-green-400 to-green-600" },
  { name: "Language Learning", icon: "🗣️", color: "from-yellow-400 to-yellow-600" },
  { name: "Art & Creativity", icon: "🎨", color: "from-pink-400 to-pink-600" },
  { name: "History", icon: "📜", color: "from-amber-400 to-amber-600" },
  { name: "Computer Science", icon: "💻", color: "from-indigo-400 to-indigo-600" },
  { name: "Music", icon: "🎵", color: "from-purple-400 to-purple-600" },
  { name: "Physical Education", icon: "⚽", color: "from-red-400 to-red-600" },
  { name: "Literature", icon: "📚", color: "from-teal-400 to-teal-600" },
  { name: "Social Studies", icon: "🌍", color: "from-cyan-400 to-cyan-600" },
  { name: "Economics", icon: "📊", color: "from-orange-400 to-orange-600" },
  { name: "Philosophy", icon: "🤔", color: "from-gray-400 to-gray-600" }
];

const learningStyles = [
  { name: "Visual", icon: "👁️", description: "Learn best through images, diagrams, and spatial understanding" },
  { name: "Auditory", icon: "👂", description: "Prefer learning through listening and speaking" },
  { name: "Reading/Writing", icon: "✍️", description: "Excel with text-based input and output" },
  { name: "Kinesthetic", icon: "🤸", description: "Learn by doing, hands-on experiences, and physical activities" }
];

export default function Onboarding() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [userProfile, setUserProfile] = useState({
    name: "",
    age: "",
    parentEmail: "",
    isUnder13: false,
    parentalConsent: false,
    allowVoiceChat: false,
    interests: [],
    weeklyGoal: 3,
    notifications: true,
    learningStyle: "",
    difficultyPreference: "balanced"
  });
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [parentalConsentSent, setParentalConsentSent] = useState(false);
  const [parentalConsentReceived, setParentalConsentReceived] = useState(false);
  const [error, setError] = useState("");
  const [emailSending, setEmailSending] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isLoaded) {
      setLoading(false);
      if (user?.fullName) {
        setUserProfile(prev => ({ ...prev, name: user.fullName }));
      }
      if (user?.unsafeMetadata.onboardingComplete) {
        router.push('/');
      }
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    const checkExistingProfile = async () => {
      if (user?.id) {
        const docRef = doc(db, "userProfiles", user.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserProfile(prev => ({ ...prev, ...data }));
          if (data.parentalConsent) {
            setParentalConsentReceived(true);
          }
          if (data.onboardingComplete) {
            router.push('/');
          }
        }
      }
    };
    checkExistingProfile();
  }, [user, router]);

  useEffect(() => {
    const checkParentalConsent = async () => {
      if (user?.id && userProfile.isUnder13) {
        const docRef = doc(db, "userProfiles", user.id);
        const unsubscribe = onSnapshot(docRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            if (data.parentalConsent) {
              setParentalConsentReceived(true);
              setUserProfile(prev => ({ ...prev, parentalConsent: true }));
            }
          }
        });

        return () => unsubscribe();
      }
    };

    checkParentalConsent();
  }, [user, userProfile.isUnder13]);

  const updateUserProfile = (key, value) => {
    setUserProfile(prevProfile => {
      const updatedProfile = { ...prevProfile, [key]: value };
      
      if (key === "age") {
        const age = parseInt(value);
        updatedProfile.isUnder13 = age < 13;
        if (age >= 13) {
          updatedProfile.parentalConsent = true;
          setParentalConsentReceived(true);
        } else {
          updatedProfile.parentalConsent = false;
          setParentalConsentReceived(false);
        }
      }

      return updatedProfile;
    });
    setScore(prevScore => prevScore + 5);
  };

  const handleSendConsentEmail = async () => {
    if (!userProfile.parentEmail) {
      setError("Please enter a parent's email address.");
      return;
    }
    setEmailSending(true);
    setError("");
    try {
      const result = await sendConsentEmail(userProfile.parentEmail, user?.id);
      if (result.success) {
        setParentalConsentSent(true);
        if (user?.id) {
          await updateDoc(doc(db, "userProfiles", user.id), {
            parentEmail: userProfile.parentEmail,
            parentalConsentEmailSent: true
          });
        }
      } else {
        setError(result.message || "Failed to send consent email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending consent email:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setEmailSending(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length) {
      if (currentStep === 2 && userProfile.isUnder13 && !parentalConsentReceived) {
        if (!parentalConsentSent) {
          await handleSendConsentEmail();
        }
        return;
      }
      setCurrentStep(currentStep + 1);
      setScore(score + 10);
    } else {
      setIsComplete(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (isSignedIn && user) {
        try {
          await setDoc(doc(db, "userProfiles", user.id), {
            ...userProfile,
            onboardingComplete: true
          });
          await user.update({
            unsafeMetadata: {
              onboardingComplete: true,
              isUnder13: userProfile.isUnder13,
              parentalConsent: userProfile.parentalConsent,
              allowVoiceChat: userProfile.allowVoiceChat
            }
          });
          console.log("User profile saved successfully");
          setTimeout(() => {
            router.push('/');
          }, 5000);
        } catch (error) {
          console.error("Error saving user profile: ", error);
          setError("Failed to save your profile. Please try again.");
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  if (loading || !isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <DotLoader color="#9570FF" size={60} />
      </div>
    );
  }

  if (!isSignedIn) {
    router.push('/sign-up');
    return null;
  }

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center flex-col justify-center p-5 mt-10 min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-purple-600 dark:to-indigo-800 relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 dark:bg-yellow-700 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center justify-between w-full max-w-4xl p-8 rounded-[30px] shadow-lg mb-8 overflow-hidden z-10 bg-white dark:bg-purple-700"
        >
          <div className="relative z-10 flex-1">
            <motion.h1
              className="text-4xl font-bold text-purple-800 dark:text-white mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {steps[currentStep - 1].name}
            </motion.h1>
            <motion.p
              className="text-xl text-purple-600 dark:text-white text-opacity-80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Step {currentStep} of {steps.length}
            </motion.p>
            <Progress value={progressPercentage} className="mt-4" />
          </div>
          <motion.div
            className="w-40 h-40 flex-shrink-0 relative z-10"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Lottie animationData={PandaAnimation} loop={true} />
          </motion.div>
        </motion.div>

        <Card className="w-full max-w-4xl bg-white dark:bg-[#151515] text-purple-900 dark:text-white border-none shadow-2xl rounded-[30px] overflow-hidden z-10">
          <CardHeader className="border-b border-purple-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                {steps.map((step) => (
                  <TooltipProvider key={step.id}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            step.id <= currentStep ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{step.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
              <div className="flex items-center space-x-4">
                <motion.div
                  className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600 px-4 py-2 rounded-full shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Star className="w-5 h-5 text-yellow-900" />
                  <span className="text-sm font-bold text-yellow-900">{score} XP</span>
                </motion.div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={isComplete ? 'complete' : currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {isComplete ? (
                  <div className="text-center space-y-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      <Lottie
                        animationData={CelebrationAnimation}
                        loop={true}
                        className="w-64 h-64 mx-auto"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h2 className="text-4xl font-bold text-purple-800 dark:text-purple-200">Congratulations, {userProfile.name}!</h2>
                      <p className="text-xl text-purple-600 dark:text-gray-300 mt-2">
                        You've Unlocked Your Learning Adventure!
                      </p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="space-y-4"
                    >
                      <p className="text-lg text-purple-700 dark:text-gray-300">
                        Your personalized learning journey is ready. Explore new horizons, challenge yourself, and grow with every lesson!
                      </p>
                      <p className="text-md text-purple-500 dark:text-gray-400">
                        You'll be redirected to your dashboard in a few seconds...
                      </p>
                    </motion.div>
                  </div>
                ) : (
                  <>
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-200">Welcome! Let's Get Started</h2>
                        <p className="text-purple-700 dark:text-gray-300">First, let's make sure we have your name right. This helps us personalize your learning experience.</p>
                        <div className="space-y-4">
                          <Label htmlFor="name" className="text-lg font-medium text-purple-700 dark:text-white">Your Name</Label>
                          <Input
                            id="name"
                            value={userProfile.name}
                            onChange={(e) => updateUserProfile("name", e.target.value)}
                            placeholder="Enter your name"
                            className="w-full bg-purple-50 dark:bg-gray-800 border-purple-200 dark:border-gray-700 text-purple-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-200">Age Verification</h2>
                        <p className="text-purple-700 dark:text-gray-300">To ensure we provide the right experience, please tell us your age.</p>
                        <div className="space-y-4">
                          <Label htmlFor="age" className="text-lg font-medium text-purple-700 dark:text-white">Your Age</Label>
                          <Input
                            id="age"
                            type="number"
                            value={userProfile.age}
                            onChange={(e) => updateUserProfile("age", e.target.value)}
                            placeholder="Enter your age"
                            className="w-full bg-purple-50 dark:bg-gray-800 border-purple-200 dark:border-gray-700 text-purple-900 dark:text-white"
                          />
                        </div>
                        {userProfile.isUnder13 && (
                          <div className="space-y-4 mt-6">
                            <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300">Parental Consent</h3>
                            <p className="text-purple-600 dark:text-gray-300">Since you're under 13, we need your parent's permission. Please provide their email address.</p>
                            <Input
                              id="parentEmail"
                              type="email"
                              value={userProfile.parentEmail}
                              onChange={(e) => updateUserProfile("parentEmail", e.target.value)}
                              placeholder="Parent's email address"
                              className="w-full bg-purple-50 dark:bg-gray-800 border-purple-200 dark:border-gray-700 text-purple-900 dark:text-white"
                              disabled={parentalConsentReceived}
                            />
                            {!parentalConsentReceived && (
                              <Button
                                onClick={handleSendConsentEmail}
                                disabled={!userProfile.parentEmail || emailSending || parentalConsentSent}
                                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                {emailSending ? "Sending..." : parentalConsentSent ? "Consent Email Sent" : "Send Parental Consent Email"}
                              </Button>
                            )}
                            {parentalConsentSent && !parentalConsentReceived && (
                              <Alert className="bg-yellow-100 dark:bg-yellow-800 border-yellow-300 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200">
                                <Mail className="h-4 w-4" />
                                <AlertTitle>Waiting for Parental Consent</AlertTitle>
                                <AlertDescription>
                                  We've sent an email to your parent for consent. Please ask them to check their inbox and follow the instructions. You can proceed once we receive their consent.
                                </AlertDescription>
                              </Alert>
                            )}
                            {parentalConsentReceived && (
                              <Alert className="bg-green-100 dark:bg-green-800 border-green-300 dark:border-green-600 text-green-800 dark:text-green-200">
                                <Check className="h-4 w-4" />
                                <AlertTitle>Parental Consent Received</AlertTitle>
                                <AlertDescription>
                                  Great news! We've received parental consent. You can now proceed with the onboarding process.
                                </AlertDescription>
                              </Alert>
                            )}
                            {error && (
                              <Alert variant="destructive" className="bg-red-100 dark:bg-red-800 border-red-300 dark:border-red-600 text-red-800 dark:text-red-200">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                              </Alert>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-200">Choose Your Learning Interests</h2>
                        <p className="text-purple-700 dark:text-gray-300">Select the subjects that excite you the most. Your choices will help us tailor your learning experience.</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {interestAreas.map((interest) => (
                            <motion.button
                              key={interest.name}
                              onClick={() => {
                                const updatedInterests = userProfile.interests.includes(interest.name)
                                  ? userProfile.interests.filter((i) => i !== interest.name)
                                  : [...userProfile.interests, interest.name]
                                updateUserProfile("interests", updatedInterests)
                              }}
                              className={`flex items-center justify-start space-x-2 h-auto py-3 px-4 ${userProfile.interests.includes(interest.name)
                                ? `bg-gradient-to-r ${interest.color} text-white`
                                : "bg-purple-50 dark:bg-gray-800 text-purple-700 dark:text-gray-200"
                                } rounded-lg transition-all duration-300 hover:shadow-md`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span className="text-2xl">{interest.icon}</span>
                              <span>{interest.name}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-200">Set Your Weekly Learning Goal</h2>
                        <p className="text-purple-700 dark:text-gray-300">
                          How many learning sessions would you like to complete each week? Aim for a goal that's challenging but achievable.
                        </p>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="weekly-goal" className="text-lg font-medium text-purple-700 dark:text-white">
                              Weekly Sessions: {userProfile.weeklyGoal}
                            </Label>
                            <Badge variant="secondary" className="text-sm">
                              {userProfile.weeklyGoal <= 2 ? "Beginner" : userProfile.weeklyGoal <= 4 ? "Intermediate" : "Advanced"}
                            </Badge>
                          </div>
                          <Slider
                            id="weekly-goal"
                            min={1}
                            max={7}
                            step={1}
                            value={[userProfile.weeklyGoal]}
                            onValueChange={(value) => updateUserProfile("weeklyGoal", value[0])}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-purple-600 dark:text-gray-400">
                            <span>1 session</span>
                            <span>7 sessions</span>
                          </div>
                        </div>
                        <motion.div
                          className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 p-4 rounded-lg shadow-inner"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">Goal Insights</h3>
                          <p className="text-purple-700 dark:text-gray-300">
                            {userProfile.weeklyGoal} sessions per week is a {userProfile.weeklyGoal <= 2 ? "gentle" : userProfile.weeklyGoal <= 4 ? "steady" : "ambitious"} pace.
                            This goal will help you {userProfile.weeklyGoal <= 2 ? "build a consistent habit" : userProfile.weeklyGoal <= 4 ? "make significant progress " : "advance rapidly "}
                            in your chosen subjects.
                          </p>
                        </motion.div>
                      </div>
                    )}
                    {currentStep === 5 && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-200">Customize Your Learning Experience</h2>
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-4">Your Learning Style</h3>
                            <p className="text-purple-600 dark:text-gray-300 mb-4">
                              Everyone learns differently. Select the style that best describes how you prefer to absorb information.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {learningStyles.map((style) => (
                                <motion.button
                                  key={style.name}
                                  onClick={() => updateUserProfile("learningStyle", style.name)}
                                  className={`flex items-start space-x-3 h-auto py-4 px-4 ${userProfile.learningStyle === style.name
                                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                    : "bg-purple-50 dark:bg-gray-800 text-purple-700 dark:text-gray-200"
                                    } rounded-lg transition-all duration-300 hover:shadow-md`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <span className="text-2xl">{style.icon}</span>
                                  <div className="text-left">
                                    <div className="font-semibold">{style.name}</div>
                                    <div className="text-sm mt-1">{style.description}</div>
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-4">Difficulty Preference</h3>
                            <p className="text-purple-600 dark:text-gray-300 mb-4">
                              How challenging would you like your learning materials to be?
                            </p>
                            <div className="flex justify-between items-center space-x-4">
                              <motion.button
                                onClick={() => updateUserProfile("difficultyPreference", "easier")}
                                className={`flex-1 py-2 rounded-lg ${userProfile.difficultyPreference === "easier"
                                  ? "bg-green-500 text-white"
                                  : "bg-purple-50 dark:bg-gray-800 text-purple-700 dark:text-gray-200"
                                  }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Easier
                              </motion.button>
                              <motion.button
                                onClick={() => updateUserProfile("difficultyPreference", "balanced")}
                                className={`flex-1 py-2 rounded-lg ${userProfile.difficultyPreference === "balanced"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-purple-50 dark:bg-gray-800 text-purple-700 dark:text-gray-200"
                                  }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Balanced
                              </motion.button>
                              <motion.button
                                onClick={() => updateUserProfile("difficultyPreference", "harder")}
                                className={`flex-1 py-2 rounded-lg ${userProfile.difficultyPreference === "harder"
                                  ? "bg-red-500 text-white"
                                  : "bg-purple-50 dark:bg-gray-800 text-purple-700 dark:text-gray-200"
                                  }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Harder
                              </motion.button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300">Notifications</h3>
                              <p className="text-purple-600 dark:text-gray-300">
                                Receive reminders and updates about your learning progress.
                              </p>
                            </div>
                            <Switch
                              checked={userProfile.notifications}
                              onCheckedChange={(checked) => updateUserProfile("notifications", checked)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
          {!isComplete && (
            <CardFooter className="flex justify-between border-t border-purple-100 dark:border-gray-700 p-6">
              <motion.button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentStep === 1
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
                whileHover={currentStep !== 1 ? { scale: 1.05 } : {}}
                whileTap={currentStep !== 1 ? { scale: 0.95 } : {}}
              >
                <ChevronLeft className="mr-2 h-4 w-4 inline" /> Back
              </motion.button>
              <motion.button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !userProfile.name) ||
                  (currentStep === 2 && (!userProfile.age || (userProfile.isUnder13 && !parentalConsentReceived))) ||
                  (currentStep === 3 && userProfile.interests.length === 0)
                }
                className={`px-4 py-2 rounded-lg ${
                  (currentStep === 1 && !userProfile.name) ||
                  (currentStep === 2 && (!userProfile.age || (userProfile.isUnder13 && !parentalConsentReceived))) ||
                  (currentStep === 3 && userProfile.interests.length === 0)
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                }`}
                whileHover={
                  ((currentStep !== 1 || userProfile.name) &&
                  (currentStep !== 2 || (userProfile.age && (!userProfile.isUnder13 || parentalConsentReceived))) &&
                  (currentStep !== 3 || userProfile.interests.length > 0))
                    ? { scale: 1.05 }
                    : {}
                }
                whileTap={
                  ((currentStep !== 1 || userProfile.name) &&
                  (currentStep !== 2 || (userProfile.age && (!userProfile.isUnder13 || parentalConsentReceived))) &&
                  (currentStep !== 3 || userProfile.interests.length > 0))
                    ? { scale: 0.95 }
                    : {}
                }
              >
                {currentStep === steps.length ? "Complete" : "Next"} <ChevronRight className="ml-2 h-4 w-4 inline" />
              </motion.button>
            </CardFooter>
          )}
        </Card>
      </motion.section>
    </AnimatePresence>
  )
}