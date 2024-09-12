"use client"

import { useState } from 'react'
import YouTube from 'react-youtube'

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
    <div className="w-full max-w-[90rem] mx-auto px-4 py-12 mt-[110px]">
      <h1 className="text-4xl font-bold text-center mb-8">
        How Panda Buddy Transforms <br className="hidden sm:inline" /> Your Learning Experience
      </h1>

      <div className="flex justify-center">
        <figure className="relative z-[1] w-full max-w-[50rem] lg:max-w-[70rem] h-auto rounded-lg shadow-[0_2.75rem_3.5rem_-2rem_rgb(45_55_75_/_20%),_0_0_5rem_-2rem_rgb(45_55_75_/_15%)] dark:shadow-[0_2.75rem_3.5rem_-2rem_rgb(0_0_0_/_20%),_0_0_5rem_-2rem_rgb(0_0_0_/_15%)]">
          <div className="relative flex items-center w-full bg-gray-800 rounded-t-lg py-2 px-24 dark:bg-neutral-700">
            <div className="flex gap-x-1 absolute top-2/4 start-4 -translate-y-1/2">
              <span className="w-2 h-2 bg-red-500 rounded-full dark:bg-neutral-600"></span>
              <span className="w-2 h-2 bg-yellow-500 rounded-full dark:bg-neutral-600"></span>
              <span className="w-2 h-2 bg-green-500 rounded-full dark:bg-neutral-600"></span>
            </div>
            <div className="flex justify-center items-center w-full h-full bg-gray-700 text-[.25rem] text-gray-400 rounded-sm sm:text-[.5rem] dark:bg-neutral-600 dark:text-neutral-400">https://panda-buddy.vercel.app</div>
          </div>

          <div className="bg-gray-800 rounded-b-lg">
            <YouTube
              videoId={videoId}
              opts={opts}
              className="w-full aspect-video rounded-b-lg"
            />
          </div>
        </figure>
      </div>
    </div>
  )
}