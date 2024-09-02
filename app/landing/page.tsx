import LandingAbout from '@/components/landing/LandingAbout'
import LandingCta from '@/components/landing/LandingCta'
import LandingFeatures from '@/components/landing/LandingFeatures'
import LandingHero from '@/components/landing/LandingHero'
import LandingNav from '@/components/landing/LandingNav'
import LandingTestimonials from '@/components/landing/LandingTestimonials'

const LandingPage = () => {
  return (
    <div>
        <LandingNav />
        <LandingHero />
        <LandingFeatures />
        <LandingTestimonials />
        <LandingAbout />
        <LandingCta />
    </div>
  )
}

export default LandingPage