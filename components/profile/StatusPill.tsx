"use client";

import React from "react";

export default function StatusPill({
  label,
  color,
}: {
  label: string;
  color: "green" | "yellow" | "red";
}) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium";
  if (color === "green")
    return (
      <span className={`${base} bg-emerald-500/10 text-emerald-300`}>
        {label}
      </span>
    );
  if (color === "yellow")
    return (
      <span className={`${base} bg-amber-500/10 text-amber-300`}>{label}</span>
    );
  return (
    <span className={`${base} bg-rose-500/10 text-rose-300`}>{label}</span>
  );
}
