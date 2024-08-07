"use client"
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

import MiniGameNav from "@/components/MiniGameNav";
import { postRequest } from "@/utils/api";
import MiniGame from "@/components/MiniGame";

const MiniGamePage = ({ params }: { params: { courseId: any } }) => {
  const { courseId } = params;
  const [category, level, selectedSubject] = courseId
    .split("_")
    .map(decodeURIComponent);
  const { user } = useUser();
  const userId = user?.id;

  return (
    <div className="p-6">
      <MiniGameNav score={0} numberOfHearts={5} />

      <MiniGame />
    </div>
  );
};

export default MiniGamePage;
