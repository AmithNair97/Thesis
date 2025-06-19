"use client";
import { useEffect, useState } from "react";

type Props = {
  dataset: string | null;
  fromDate: string | null;
  toDate: string | null;
  category: string | null;
};

export default function DownloadGuide({ dataset, fromDate, toDate, category }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hide guide when all filters are selected
    if (dataset && fromDate && toDate && category) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [dataset, fromDate, toDate, category]);

  if (!visible) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-xl text-yellow-800 mb-4 shadow-sm">
      <h4 className="font-semibold mb-1">📥 How to Download Files</h4>
      <ul className="list-disc list-inside text-sm space-y-1">
        <li>Select a <strong>dataset</strong> from the dropdown</li>
        <li>Pick a <strong>date range</strong> (From – To)</li>
        <li>Choose a <strong>category</strong></li>
        <li>Then you can select files and click <strong>Download</strong></li>
      </ul>
    </div>
  );
}
