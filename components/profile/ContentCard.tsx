"use client";

import React from "react";

interface ContentCardProps {
  title: string;
  children: React.ReactNode;
}

export default function ContentCard({
  title,
  children,
}: Readonly<ContentCardProps>) {
  return (
    <div className="overflow-x-scroll flex flex-col gap-7 py-4">
      <div className="flex gap-3 justify-center md:justify-start items-center">
        <div className="h-6 hidden md:block rounded-full bg-error-500 w-0.75" />
        <h2 className="text-lg font-semibold tracking-tight text-zinc-50">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
