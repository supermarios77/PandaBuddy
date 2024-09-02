import Link from 'next/link';
import React from 'react';
import { BackgroundBeamsWithCollision } from '../ui/background-beams-with-collision';
import { HoverBorderGradient } from '../ui/hover-border-gradient';

const LandingHero = () => {
    return (
        <section className="min-h-max bg-white dark:bg-gray-950">
            <BackgroundBeamsWithCollision>
                <div className="absolute top-0 inset-x-0 h-64 flex items-start">
                    <div className="h-24 w-2/3 bg-gradient-to-br from-purple-500 opacity-20 blur-2xl dark:from-purple-700 dark:invisible dark:opacity-40">
                    </div>
                    <div className="h-20 w-3/5 bg-gradient-to-r from-blue-600 opacity-40 blur-2xl dark:from-purple-700 dark:opacity-40">
                    </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-2/5 aspect-[2/0.5] bg-gradient-to-br from-purple-600 to-violet-400 rounded-full opacity-50 blur-2xl">
                </div>
                <div className="relative mx-auto pt-32 pb-24 lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 text-center space-y-10">
                    <h1 className="text-gray-900 dark:text-white mx-auto max-w-5xl font-bold text-4xl/tight sm:text-5xl/tight lg:text-6xl/tight xl:text-7xl/tight">
                        Learn <span className='bg-gradient-to-r from-[#7424b9] to-[#5b66df] bg-clip-text text-transparent'>Smarter</span> With Panda Buddy
                    </h1>
                    <p className="text-gray-700 dark:text-gray-300 mx-auto max-w-2xl">
                        Elevate your study sessions with AI-driven tools designed to make learning more efficient and personalized. Discover how Panda Buddy can help you organize, study, and excel in your academics like never before.
                    </p>
                    <div className="flex justify-center items-center flex-wrap mx-auto gap-4">
                        <HoverBorderGradient>
                            <Link href="#">
                                Get started now
                            </Link>
                        </HoverBorderGradient>
                        <HoverBorderGradient className='bg-white text-black border-card'>
                            <Link href="#">
                                Learn more
                            </Link>
                        </HoverBorderGradient>
                    </div>
                </div>
            </BackgroundBeamsWithCollision>
        </section>
    )
}

export default LandingHero;