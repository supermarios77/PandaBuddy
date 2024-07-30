"use client"
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { app } from "@/lib/firebaseConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const auth = getAuth(app);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setError("");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("User logged in:", userCredential.user);
      router.push("/study");
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
              Login
            </h2>
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
              onClick={handleLogin}
            >
              Login
            </Button>
            {error && <p className="text-red-500">{error}</p>}
            <div className="text-center text-sm text-[#7b8794] dark:text-white">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-[#00b894] underline dark:text-[#55efc4]"
                prefetch={false}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}