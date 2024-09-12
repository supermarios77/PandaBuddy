import { Button } from "@/components/ui/button"
import { SignUpButton } from "@clerk/nextjs"
import { CheckIcon } from "lucide-react"

export default function LandingPricing() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 overflow-hidden">
            <h1 className="text-4xl font-bold text-center mb-8">
                Pricing Plans
            </h1>
            <div className="container px-4 md:px-6">
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="flex flex-col items-start gap-6 rounded-lg bg-background p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl md:p-8">
                        <div className="grid gap-2">
                            <h3 className="text-2xl font-bold">Free</h3>
                            <p className="text-muted-foreground">
                                Perfect for beginners. Get started with up to 3 courses and basic features to explore Panda Buddy's
                                tools.
                            </p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold">$0</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                        <ul className="grid gap-2 text-sm">
                            <li className="flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 fill-primary" />
                                3 courses
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 fill-primary" />
                                Basic features
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 fill-primary" />
                                1 user
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 fill-primary" />
                                Community support
                            </li>
                        </ul>
                        <SignUpButton>
                            <Button size="lg" className="transform transition-transform duration-300 hover:scale-105">
                                Get Started
                            </Button>
                        </SignUpButton>
                    </div>
                    <div className="flex flex-col items-start gap-6 rounded-lg bg-indigo-500 p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl md:p-8">
                        <div className="grid gap-2">
                            <h3 className="text-2xl font-bold text-primary-foreground">Premium</h3>
                            <p className="text-primary-foreground">
                                Unlock unlimited courses, advanced AI-powered features, and in-depth analytics to personalize your
                                learning path.
                            </p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-primary-foreground">$19</span>
                            <span className="text-primary-foreground">/month</span>
                        </div>
                        <ul className="grid gap-2 text-sm text-primary-foreground">
                            <li className="flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 fill-primary-foreground" />
                                Unlimited courses
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 fill-primary-foreground" />
                                Advanced AI-powered features
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 fill-primary-foreground" />
                                In-depth analytics
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 fill-primary-foreground" />
                                Priority support
                            </li>
                        </ul>
                        <SignUpButton>
                            <Button
                                size="lg"
                                variant="secondary"
                                className="transform transition-transform duration-300 hover:scale-105"
                            >
                                Get Started
                            </Button>
                        </SignUpButton>
                    </div>
                    <div className="flex flex-col items-start gap-6 rounded-lg bg-background p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl md:p-8">
                        <div className="grid gap-2">
                            <h3 className="text-2xl font-bold">Family</h3>
                            <p className="text-muted-foreground">
                                Share the experience with up to 4 family members, each with their own personalized learning paths and
                                rewards.
                            </p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold">$49</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                        <ul className="grid gap-2 text-sm">
                            <li className="flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 fill-primary" />
                                Unlimited courses
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 fill-primary" />
                                Personalized learning paths
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 fill-primary" />
                                Up to 4 family members
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 fill-primary" />
                                Dedicated support
                            </li>
                        </ul>
                        <SignUpButton>
                            <Button size="lg" className="transform transition-transform duration-300 hover:scale-105">
                                Get Started
                            </Button>
                        </SignUpButton>
                    </div>
                </div>
            </div>
        </section>
    )
}