"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useDataset } from "@/context/DatasetContext";

type Props = {
  onSelectCategory: (category: string) => void;
};

export default function CategoryBox({ onSelectCategory }: Props) {
  const { selectedDataset } = useDataset();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!selectedDataset) return;

    axios
      .get(`http://localhost:8000/categories/by-dataset/${selectedDataset}`)
      .then((res) => setCategories(res.data));
  }, [selectedDataset]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
      <h3 className="text-md font-semibold mb-2 text-gray-800">
        🗂️ Categories in{" "}
        <span className="text-blue-500">{selectedDataset}</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {categories.length === 0 ? (
          <p className="text-gray-500 text-sm">No categories found for this dataset.</p>
        ) : (
          categories.map((category: any) => (
            <button
              key={category.name}
              onClick={() => onSelectCategory(category.name)}
              className="px-3 py-1 bg-gray-100 rounded-full hover:bg-blue-100 text-sm transition"
            >
              {category.name}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
