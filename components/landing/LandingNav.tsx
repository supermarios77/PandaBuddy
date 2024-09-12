import { SignInButton, SignUpButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import ThemeSwitch from '../ThemeSwitch'
import { Button } from '../ui/button'

const LandingNav = () => {
  return (
    <div className="w-full bg-background border-b border-border">
      <nav className="flex items-center justify-between p-3 sm:p-4 mx-auto max-w-screen-xl lg:px-8 xl:px-16">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/icon.png"
            alt="Panda Buddy logo"
            width={28}
            height={28}
            className="rounded-lg sm:w-8 sm:h-8"
          />
          <span className="text-base sm:text-lg md:text-xl font-bold">Panda Buddy</span>
        </Link>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <SignInButton>
            <Button
              variant="default"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm md:text-base px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2"
            >
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button
              variant="outline"
              className="relative border-2 border-primary hover:bg-primary/10 comic-effect text-xs sm:text-sm md:text-base px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2"
            >
              Sign up
            </Button>
          </SignUpButton>
          <ThemeSwitch />
        </div>
      </nav>
    </div>
  )
}

export default LandingNav