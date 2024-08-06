"use client";

import React from 'react';

import ChallengeNav from '@/components/ChallengeNav';
import ChallengeFooter from '@/components/ChallengeFooter';

const ChallengePage = () => {
  return (
    <div className="flex min-h-screen flex-col">
        <ChallengeNav score={0} numberOfHearts={5} />
        
        <ChallengeFooter onCheck={function (): void {
              throw new Error('Function not implemented.');
          } } status={'none'} />
    </div>
  )
}

export default ChallengePage