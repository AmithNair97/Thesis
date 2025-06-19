"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Props = {
  fromDate: string | null;
  toDate: string | null;
  dataset: string | null;
  category?: string | null;
};

export default function DateRecentUploads({ fromDate, toDate, dataset, category }: Props) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!fromDate || !toDate || !dataset) return;

    axios
      .get(`http://localhost:8000/datafiles/by-date-range?from=${fromDate}&to=${toDate}&dataset=${dataset}`)
      .then((res) => {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);

        const filtered = res.data.filter((file: any) => {
          const fileDate = new Date(file.created_at);
          const inRange = fileDate >= from && fileDate <= to;
          const matchesCategory = !category || file.category === category;

          return inRange && matchesCategory;
        });


        const sorted = filtered.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setFiles(sorted);

      });
  },[fromDate, toDate, dataset, category]);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 transition-all hover:shadow-2xl">
      <h3 className="text-md font-semibold mb-3 text-gray-800">🕑 File Uploads</h3>
      {files.length === 0 ? (
        <p className="text-sm text-gray-500">No uploads found for this range.</p>
      ) : (
        <ul className="space-y-2 max-h-[360px] overflow-y-auto pr-2">
          {files.map((file: any, idx: number) => (
            <li
              key={idx}
              className="text-sm bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition text-gray-700"
            >
              📄 <span className="font-medium">{file.name}</span> — {file.dataset} / {file.category}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
