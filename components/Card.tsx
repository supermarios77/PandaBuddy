import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const Cards: React.FC<CardProps> = ({ icon, link, title, description }) => {
  return (
    <Link href={link} suppressHydrationWarning>
      <Card className={`p-4 rounded-lg shadow-md`}>
        <CardHeader>
          <div className="flex items-center justify-center">{icon}</div>
          <CardTitle className="text-center">{title}</CardTitle>
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default Cards;
