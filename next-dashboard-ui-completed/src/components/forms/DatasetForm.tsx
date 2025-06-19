"use client";

import { useState } from "react";

const DatasetForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
  const [name, setName] = useState(data?.name || "");
  const [author, setAuthor] = useState(data?.author || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, author };

    try {
      const res = await fetch("http://localhost:8000/datasets", {
        method: type === "create" ? "POST" : "PUT", // Replace PUT if you're using different update logic
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
        {type === "create" ? "Create New Dataset" : "Update Dataset"}
      </h2>
      <input
        type="text"
        placeholder="Dataset Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
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

export default DatasetForm;
