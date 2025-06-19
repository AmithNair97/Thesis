"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// ✅ Define the shape of each file object
type FileItem = {
  name: string;
  dataset: string;
  category: string;
};

export default function FileSearch() {
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios.get("http://localhost:8000/datafiles").then((res) => {
      setFiles(res.data);
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const result = files.find((f) =>
      f.name.toLowerCase().includes(query.toLowerCase())
    );

    if (result) {
      // ✅ Route to the correct dataset/category
      router.push(`/list/datafiles?dataset=${result.dataset}&category=${result.category}`);
    } else {
      alert("❌ File not found");
    }
  };

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="🔍 Search file by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>
    </form>
  );
}
