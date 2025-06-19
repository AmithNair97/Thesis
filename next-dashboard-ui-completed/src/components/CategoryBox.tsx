"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // ✅ import useRouter
import { useDataset } from "@/context/DatasetContext";

export default function CategoryBox() {
  const { selectedDataset } = useDataset();
  const [categories, setCategories] = useState([]);
  const router = useRouter(); // ✅ init router

  useEffect(() => {
    if (!selectedDataset) return;

    axios
      .get(`http://localhost:8000/categories/by-dataset/${selectedDataset}`)
      .then((res) => setCategories(res.data));
  }, [selectedDataset]);

  const handleCategoryClick = (categoryName: string) => {
    if (selectedDataset) {
      router.push(`/list/datafiles?dataset=${selectedDataset}&category=${categoryName}`);
    }
  };

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
              onClick={() => handleCategoryClick(category.name)} // ✅ trigger redirect
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
