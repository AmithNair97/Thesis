'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import withAuth from "@/utils/withAuth";

function AddCategoryPage() {
  const router = useRouter();
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setAuthor(parsed.name);
    }

    const fetchDatasets = async () => {
      const res = await axios.get("http://localhost:8000/datasets");
      setDatasets(res.data);
    };
    fetchDatasets();
  }, []);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDataset || !categoryName || files.length === 0) {
      setError("Please fill all fields and add at least one file.");
      return;
    }

    try {
      // 1. Create category first
      await axios.post("http://localhost:8000/add-category", {
        name: categoryName,
        dataset: selectedDataset,
        author
      });

      // 2. Upload files to the created category
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("dataset", selectedDataset);
        formData.append("category", categoryName);
        formData.append("author", author);

        await axios.post("http://localhost:8000/upload-file", formData);
      }

      alert("✅ Category and files uploaded successfully");
      router.push(`/list/categories?dataset=${selectedDataset}`);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">Create New Category</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded-lg"
          >
            <option value="">Select Dataset</option>
            {datasets.map((ds: any) => (
              <option key={ds._id} value={ds.name}>{ds.name}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg"
            required
          />

          <input
            type="text"
            value={author}
            readOnly
            className="w-full bg-gray-100 border border-gray-300 p-2 rounded-lg text-gray-500"
          />

          {/* Drag and Drop File Upload */}
          <div
            {...getRootProps()}
            className="w-full border-dashed border-2 p-6 rounded-lg text-center text-sm text-gray-500 cursor-pointer"
          >
            <input {...getInputProps()} />
            📁 Drag & drop files here or click to browse
          </div>

          {files.length > 0 && (
            <ul className="text-sm text-gray-600 mt-2 max-h-24 overflow-y-auto list-disc list-inside">
              {files.map((file, index) => (
                <li key={index}>📄 {file.name}</li>
              ))}
            </ul>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Create Category & Upload Files
          </button>

          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default withAuth(AddCategoryPage);