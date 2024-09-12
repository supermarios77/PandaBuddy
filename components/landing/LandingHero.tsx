"use client"

import { useState, useRef } from "react"
import { ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Lottie, { LottieRefCurrentProps } from "lottie-react"
import HeroPanda from "@/public/PandaWorking.json"

export default function LandingHero() {
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (lottieRef.current) {
      lottieRef.current.setSpeed(2)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (lottieRef.current) {
      lottieRef.current.setSpeed(1)
    }
  }

  return (
    <section className="w-full py-[50px] lg:mb-[180px] overflow-hidden">
      <div className="container">
        <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_650px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none tracking-wide">
                Your Ultimate Gateway to {" "}
                <span className="text-[#8e3ae3]">AI-Powered</span> {" "}
                Learning
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Excel in your studies with Panda Buddy, your smart study companion. Unlock your potential and achieve academic success.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="inline-flex items-center justify-center">
                Get Started
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="inline-flex items-center justify-center">
                Learn More
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div 
            className="flex items-center justify-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className={`relative w-full max-w-[800px] aspect-[4/3] transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}>
              <Lottie 
                animationData={HeroPanda} 
                lottieRef={lottieRef}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}