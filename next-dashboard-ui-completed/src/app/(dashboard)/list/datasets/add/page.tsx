'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import withAuth from "@/utils/withAuth";

function AddDatasetPage() {
  const router = useRouter();
  const [datasetName, setDatasetName] = useState("");
  const [author, setAuthor] = useState("TestUser"); // ✅ TEMPORARILY hardcoded author
  const [error, setError] = useState("");


  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setAuthor(parsed.name);
    }
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/add-dataset", {
        name: datasetName,
        author: author
      });
      alert("✅ Dataset created successfully!");
      router.push("/list/datasets");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">Create New Dataset</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Dataset Name"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={datasetName}
            onChange={(e) => setDatasetName(e.target.value)}
            required
          />
          <input
            type="text"
            value={author}
            readOnly
            className="w-full bg-gray-100 border border-gray-300 p-2 rounded-lg text-gray-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Create Dataset
          </button>
        </form>

        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
      </div>
    </div>
  );
}

export default withAuth(AddDatasetPage);