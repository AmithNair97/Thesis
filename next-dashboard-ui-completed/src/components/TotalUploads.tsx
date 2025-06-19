"use client";
import React from "react";

// ✅ Define props type
type Props = {
  type: "today" | "week" | "month";
};

export default function TotalUploads({ type }: Props) {
  const displayText = {
    today: "Today's Uploads",
    week: "Weekly Uploads",
    month: "Monthly Uploads",
  };

  // Dummy data for now — replace with API later
  const count = type === "today" ? 5 : type === "week" ? 28 : 112;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 transition-all hover:shadow-2xl w-full">
      <h3 className="text-sm font-semibold text-gray-500 mb-1">
        {displayText[type]}
      </h3>
      <p className="text-3xl font-bold text-gray-900">{count}</p>
    </div>
  );
}
