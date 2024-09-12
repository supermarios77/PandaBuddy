import LandingFeatures from '@/components/landing/LandingFeatures'
import LandingHero from '@/components/landing/LandingHero'
import LandingNav from '@/components/landing/LandingNav'
import LandingVideo from '@/components/landing/LandingVideo'

const LandingPage = () => {
  return (
    <div>
        <LandingNav />
        <LandingHero />
        <LandingVideo />
        <LandingFeatures />
    </div>
  )
}

export default LandingPage