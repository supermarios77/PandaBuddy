"use client"
import Image from "next/image"
import { Sparkles, Eye } from "lucide-react"
import { BackgroundGradient } from "../ui/background-gradient"

export default function LandingAbout() {
    return (
        <section className="transition-colors duration-200">
            <div id="about" className="max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-5 flex flex-col md:flex-row gap-16">
                <div className="flex md:flex-1">
                    <Image
                        src="https://img.freepik.com/free-psd/woman-reading-book-while-sitting-book-isolated-background-3d-illustration-cartoon-characters_1150-63072.jpg?t=st=1725296083~exp=1725299683~hmac=4ef53b08913297942b3450df28c3d3a735c51324ca2fba73e00495734c8b65af&w=2000"
                        alt="Panda Buddy Learning"
                        width={1300}
                        height={900}
                        className="w-full md:h-full object-cover rounded-3xl shadow-xl"
                    />
                </div>
                <div className="md:w-1/2 lg:w-[54%] space-y-8">
                    <h1 className="text-gray-900 dark:text-gray-100 font-bold text-3xl sm:text-4xl md:text-5xl">
                        Empowering Learning with <span className="text-purple-600 dark:text-purple-400">Panda Buddy</span>
                    </h1>
                    <p className="text-gray-700 dark:text-gray-300 text-lg">
                        What began as a simple submission for the Gemini Competition has blossomed into a passionate endeavor to transform the learning experience for students worldwide. Panda Buddy was created with the belief that education should be accessible, engaging, and tailored to each individual's needs.
                        <br />
                        Inspired by the challenges students face in today's fast-paced world, our dedicated team set out to build a platform that combines cutting-edge technology with compassionate design. Through perseverance and a shared vision, Panda Buddy has evolved into a trusted companion for learners, empowering them to achieve their fullest potential.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
                            <span className="inline-block rounded-full bg-purple-600 dark:bg-purple-500 text-white p-3">
                                <Sparkles className="w-6 h-6" />
                            </span>
                            <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100">Our Mission</h2>
                            <p className="text-gray-700 dark:text-gray-300">
                                To make learning accessible, engaging, and personalized for everyone, everywhere.
                            </p>
                        </BackgroundGradient>

                        <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
                            <span className="inline-block rounded-full bg-blue-600 dark:bg-blue-500 text-white p-3">
                                <Eye className="w-6 h-6" />
                            </span>
                            <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100">Our Vision</h2>
                            <p className="text-gray-700 dark:text-gray-300">
                                A world where every learner can reach their full potential through tailored education.
                            </p>
                        </BackgroundGradient>
                    </div>
                </div>
            </div>
        </section>
    )
}