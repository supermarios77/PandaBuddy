"use client";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { app } from "@/lib/firebaseConfig";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const auth = getAuth(app);
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      setError("");
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#f8f9fa] dark:bg-[#121212]">
      <div className="grid w-full max-w-[900px] grid-cols-1 rounded-2xl bg-white shadow-lg dark:bg-[#1e1e1e] md:grid-cols-2">
        <div className="relative flex items-center justify-center bg-[#00b894] p-8 md:p-12">
          <div className="z-10 text-center text-white">
            <h1 className="mb-4 text-4xl font-bold">Welcome to Panda Pal!</h1>
            <p className="mb-8 text-lg">
              Your friendly study buddy is here to help you succeed.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center px-4 py-8 md:p-12">
          <div className="w-full max-w-[350px] space-y-4 px-4">
            <h2 className="text-2xl font-bold text-[#00b894] dark:text-white">
              Sign Up
            </h2>
            <div className="space-y-2">
              <Label htmlFor="name" className="dark:text-white">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="rounded-lg bg-white dark:bg-[#1e1e1e] dark:text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@pandapal.com"
                className="rounded-lg bg-white dark:bg-[#1e1e1e] dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="rounded-lg bg-white dark:bg-[#1e1e1e] dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              className="w-full rounded-lg bg-[#00b894] text-white hover:bg-[#55efc4]"
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
            {error && <p className="text-red-500">{error}</p>}
            <div className="text-center text-sm text-[#7b8794] dark:text-white">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#00b894] underline dark:text-[#55efc4]"
                prefetch={false}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}