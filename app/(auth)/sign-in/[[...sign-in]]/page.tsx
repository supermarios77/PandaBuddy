'use client'

import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignInPage() {
  return (
    <motion.main
      className="flex flex-col h-screen w-full items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold text-purple-800 dark:text-purple-200 mb-2">Welcome Back to Panda Buddy</h1>
        <p className="text-gray-600 dark:text-gray-300">Sign in to continue your learning journey</p>
      </motion.div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <SignIn fallbackRedirectUrl="/" signUpFallbackRedirectUrl="/onboarding" />
      </motion.div>
    </motion.main>
  );
}