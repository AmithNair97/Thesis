"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // ✅ Import watermark image
import withAuth from "@/utils/withAuth";

function UploadPage() {
  const router = useRouter();
  const [datasets, setDatasets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) setAuthor(JSON.parse(user).name);

    axios.get("http://localhost:8000/datasets").then(res => {
      setDatasets(res.data);
    });
  }, []);

  const fetchCategories = (dataset: string) => {
    axios.get(`http://localhost:8000/categories/by-dataset/${dataset}`)
      .then(res => setCategories(res.data));
  };

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!selectedDataset || !selectedCategory || files.length === 0) {
      setError("Please select dataset/category and add files.");
      return;
    }

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("dataset", selectedDataset);
      formData.append("category", selectedCategory);
      formData.append("author", author);

      try {
        await axios.post("http://localhost:8000/upload-file", formData);
      } catch (err: any) {
        console.error(err);
        setError("One or more files failed to upload.");
        return;
      }
    }

    alert("✅ Files uploaded successfully");
    router.push("/list/datafiles");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative">
      {/* Watermark */}
      <Image
        src="/uni.png"
        alt="Watermark"
        width={260}
        height={260}
        className="fixed bottom-6 right-6 opacity-20 pointer-events-none z-0"
      />

      {/* Upload Card */}
      <div className="w-full max-w-lg bg-white rounded-xl p-8 shadow z-10">
        <h2 className="text-xl font-bold mb-4 text-center">Upload Files</h2>

        <div className="space-y-4">
          <select
            value={selectedDataset}
            onChange={(e) => {
              setSelectedDataset(e.target.value);
              fetchCategories(e.target.value);
            }}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Dataset</option>
            {datasets.map((ds: any) => (
              <option key={ds._id} value={ds.name}>{ds.name}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat: any) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <div {...getRootProps()} className="border-dashed border-2 p-6 text-center rounded cursor-pointer">
            <input {...getInputProps()} />
            <p>📁 Drag and drop files here, or click to browse</p>
          </div>

          <ul className="text-sm text-gray-600">
            {files.map((file, index) => (
              <li key={index}>📄 {file.name}</li>
            ))}
          </ul>

          <button
            onClick={handleUpload}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Upload Files
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default withAuth(UploadPage);