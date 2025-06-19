
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";

interface FileType {
  name: string;
  dataset: string;
  category: string;
  created_at: string;
}

type Props = {
  fromDate: string | null;
  toDate: string | null;
  dataset: string | null;
  category?: string | null;
};

export default function DateRecentUploads({ fromDate, toDate, dataset, category }: Props) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

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
          (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setFiles(sorted);
      });
  }, [fromDate, toDate, dataset, category]);

  const handleToggle = (filename: string) => {
    setSelectedFiles((prev) => {
      const updated = new Set(prev);
      updated.has(filename) ? updated.delete(filename) : updated.add(filename);
      return updated;
    });
  };

  const handleSelectAll = () => {
    setSelectedFiles(new Set(files.map((file) => file.name)));
  };

  const handleDeselectAll = () => {
    setSelectedFiles(new Set());
  };

  const handleDownloadSelected = () => {
    if (!dataset || !category) return alert("Dataset and category required");

    selectedFiles.forEach((filename) => {
      const url = `http://localhost:8000/download/${filename}?dataset=${dataset}&category=${category}`;
      window.open(url, "_blank");
    });
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 transition-all hover:shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold text-gray-800">🕑 File Uploads</h3>
        {files.length > 0 && (
          <div className="flex gap-2 text-sm">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
            >
              Select All
            </button>
            <button
              onClick={handleDeselectAll}
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
            >
              Deselect
            </button>
            <button
              onClick={handleDownloadSelected}
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Download
            </button>
          </div>
        )}
      </div>

      {files.length === 0 ? (
        <p className="text-sm text-gray-500">No uploads found for this range.</p>
      ) : (
        <ul className="space-y-2 max-h-[360px] overflow-y-auto pr-2">
          {files.map((file: FileType, idx: number) => (
            <li
              key={idx}
              className={`text-sm bg-gray-50 p-2 rounded-lg transition text-gray-700 flex justify-between items-center ${selectedFiles.has(file.name) ? "bg-blue-100" : "hover:bg-gray-100"}`}
            >
              <div>
                📄 <span className="font-medium">{file.name}</span> — {file.dataset} / {file.category}
              </div>
              <input
                type="checkbox"
                checked={selectedFiles.has(file.name)}
                onChange={() => handleToggle(file.name)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}