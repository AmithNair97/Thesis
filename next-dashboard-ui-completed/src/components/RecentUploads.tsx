"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RecentUploads() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/datafiles").then(res => {
      const sorted = res.data.sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setFiles(sorted.slice(0, 5));
    });
  }, []);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 transition-all hover:shadow-2xl">
      <h3 className="text-md font-semibold mb-3 text-gray-800">🕑 Recent Uploads</h3>
      <ul className="space-y-2">
        {files.map((file: any, idx: number) => (
          <li
            key={idx}
            className="text-sm bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition text-gray-700"
          >
            📄 <span className="font-medium">{file.name}</span> — {file.dataset} / {file.category}
          </li>
        ))}
      </ul>
    </div>
  );
}
