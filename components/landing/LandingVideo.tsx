"use client"
import { useState } from 'react'
import YouTube from 'react-youtube'
import { Button } from "@/components/ui/button"
import { Clock, Eye, User } from "lucide-react"

export default function LandingVideo() {
  const [videoId, setVideoId] = useState('kQwh0Srk6sQ')

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      loop: 1,
      controls: 1,
      modestbranding: 1,
      playsinline: 1,
    },
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 mt-[110px]">
      <h1 className="text-4xl font-bold text-center mb-8">
        How Panda Buddy Transforms <br /> Your Learning Experience
      </h1>

      <div className="relative bg-white dark:bg-[#1d1d1d] rounded-lg shadow-xl overflow-hidden">

        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex space-x-4">
            <Clock className="w-5 h-5 dark:text-white" />
            <Eye className="w-5 h-5 dark:text-white" />
            <User className="w-5 h-5 dark:text-white" />
          </div>
        </div>


        <div className="aspect-video w-full">
          <YouTube videoId={videoId} opts={opts} className="w-full h-full" />
        </div>


        <div className="flex justify-center space-x-8 p-4 border-t"></div>
      </div>
    </div>
  )
}