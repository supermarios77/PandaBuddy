import { SignUpButton } from '@clerk/nextjs';
import { HoverBorderGradient } from '../ui/hover-border-gradient';

const LandingCta = () => {
    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-5">
                <div className="w-full relative py-8 md:py-10 px-6 md:px-8 rounded-2xl bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-900">
                    <div className="absolute right-0 top-0 h-full w-full flex justify-end">
                        <div className="w-28 h-28 overflow-hidden flex rounded-xl relative blur-2xl">
                            <span className="absolute w-16 h-16 -top-1 -right-1 bg-blue-500 rounded-md rotate-45" />
                            <span className="absolute w-16 h-16 -bottom-1 -right-1 bg-teal-500 rounded-md rotate-45" />
                            <span className="absolute w-16 h-16 -bottom-1 -left-1 bg-indigo-300 rounded-md rotate-45" />
                        </div>
                    </div>
                    <div className="absolute left-0 bottom-0 h-full w-full flex items-end">
                        <div className="w-28 h-28 overflow-hidden flex rounded-xl relative blur-2xl">
                            <span className="absolute w-16 h-16 -top-1 -right-1 bg-blue-500 rounded-md rotate-45" />
                            <span className="absolute w-16 h-16 -bottom-1 -right-1 bg-teal-500 rounded-md rotate-45" />
                            <span className="absolute w-16 h-16 -bottom-1 -left-1 bg-indigo-300 rounded-md rotate-45" />
                        </div>
                    </div>
                    <div className="mx-auto text-center max-w-xl md:max-w-2xl relative space-y-8">
                        <h1 className="text-3xl/tight sm:text-4xl/tight md:text-5xl/tight font-bold text-blue-950 dark:text-white">
                            Start your <span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-300 from-20% via-indigo-300 via-30% to-pink-300">Ultimate Studying</span> Experience Today!
                        </h1>
                        <p className="text-gray-700 dark:text-gray-300">
                            Join thousands of students who are boosting their productivity and achieving their academic goals with Panda Buddy. Whether you're preparing for exams or just an avid learner, our AI-powered tools are here to help you succeed.
                        </p>
                        <div className="mx-auto max-w-md sm:max-w-xl flex justify-center">
                            <SignUpButton>
                                <HoverBorderGradient className='bg-[#904bff]'>
                                    Sign up to Panda Buddy today!
                                </HoverBorderGradient>
                            </SignUpButton>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandingCta;