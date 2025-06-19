"use client";

import { useState } from "react";

const CategoryForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const [name, setName] = useState(data?.name || "");
  const [dataset, setDataset] = useState(data?.dataset || "");
  const [author, setAuthor] = useState(data?.author || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, dataset, author };

    try {
      const res = await fetch("http://localhost:8000/categories", {
        method: type === "create" ? "POST" : "PUT", // Or PATCH depending on your API
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      alert(`${type} success!`);
      console.log(result);
    } catch (err) {
      console.error("❌ Error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-center">
        {type === "create" ? "Create New Category" : "Update Category"}
      </h2>

      <input
        type="text"
        placeholder="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="Dataset Name"
        value={dataset}
        onChange={(e) => setDataset(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <button
        type="submit"
        className="bg-lamaPurple text-white py-2 px-4 rounded-md border-none self-center"
      >
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default CategoryForm;
