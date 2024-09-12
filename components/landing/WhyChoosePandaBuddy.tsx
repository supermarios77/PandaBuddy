import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';

const WhyChoosePandaBuddy: React.FC = () => {
    const features = [
        {
            title: 'Gamified Achievements',
            description: 'Earn badges, unlock achievements, and celebrate your progress as you master new skills. Our gamified system keeps you motivated and engaged.',
            icon: '/images/Favorites.svg',
            class: 'bg-[#FF9900] text-black bg-opacity-50',
        },
        {
            title: 'Cloud-Based Learning',
            description: 'Access your personalized learning materials from any device, anywhere. Panda Buddy’s cloud-based system ensures your progress is always synchronized and secure.',
            icon: '/images/Cloud.png',
            class: 'bg-[#00A3FF] text-black bg-opacity-50',
        },
        {
            title: 'Diverse Learning Resources',
            description: 'Explore a wide range of study materials and tools designed to cater to various learning styles and preferences.',
            icon: '/images/Box.png',
            class: 'bg-[#EDD462] text-black bg-opacity-50',
        },
    ];

    return (
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto mt-10">
            <h1 className="text-4xl font-bold text-center mb-8">
                Why Choose Panda Buddy?
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className={clsx(
                            "shadow-lg rounded-lg p-5 flex flex-col min-w-[300px] max-w-full",
                            feature.class
                        )}
                    >
                        <div className="flex items-center gap-x-4 mb-3">
                            <Image src={feature.icon} width={62} height={62} alt={feature.title} />
                            <div className="shrink-0">
                                <h3 className="block text-lg font-semibold">
                                    {feature.title}
                                </h3>
                            </div>
                        </div>
                        <p className="flex-grow">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WhyChoosePandaBuddy;
