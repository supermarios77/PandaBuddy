import { ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function LandingHero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 lg:mb-[180px]">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_650px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Your Ultimate Gateway to{" "}
                <span className="text-primary">AI-Powered Learning</span>
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
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[600px] aspect-[4/3]">
              <Image
                src="/images/hero-image.jpeg"
                alt="Student using a tablet with holographic AI elements"
                fill
                className="object-cover rounded-lg shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-lg" />
              <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-md p-2 text-sm font-medium">
                AI-Enhanced Learning Experience
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}