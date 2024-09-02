import LandingFeatures from '@/components/landing/LandingFeatures'
import LandingHero from '@/components/landing/LandingHero'
import LandingNav from '@/components/landing/LandingNav'

const LandingPage = () => {
  return (
    <div>
        <LandingNav />
        <LandingHero />
        <LandingFeatures />
    </div>
  )
}

export default LandingPage