import LandingCta from '@/components/landing/LandingCTA'
import LandingFeatures from '@/components/landing/LandingFeatures'
import LandingHero from '@/components/landing/LandingHero'
import LandingNav from '@/components/landing/LandingNav'
import LandingPricing from '@/components/landing/LandingPricing'
import LandingVideo from '@/components/landing/LandingVideo'
import WhyChoosePandaBuddy from '@/components/landing/WhyChoosePandaBuddy'

const LandingPage = () => {
  return (
    <div className='landing'>
        <LandingNav />
        <LandingHero />
        <LandingVideo />
        <LandingFeatures />
        <WhyChoosePandaBuddy />
        <LandingPricing />
        <LandingCta />
    </div>
  )
}

export default LandingPage