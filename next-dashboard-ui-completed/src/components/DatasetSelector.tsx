"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useDataset } from "@/context/DatasetContext";

export default function DatasetSelector() {
  const [datasets, setDatasets] = useState([]);
  const { selectedDataset, setSelectedDataset } = useDataset();

  useEffect(() => {
    axios.get("http://localhost:8000/datasets").then((res) => {
      setDatasets(res.data);
    });
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 transition-all hover:shadow-2xl mb-4">
      <label className="block font-semibold mb-2 text-gray-700">🗂️ Select Dataset</label>
      <select
        value={selectedDataset}
        onChange={(e) => setSelectedDataset(e.target.value)}
        className="p-2 rounded-lg border w-full focus:outline-none focus:ring focus:border-blue-300"
      >
        <option value="">-- Choose a dataset --</option>
        {datasets.map((ds: any) => (
          <option key={ds._id} value={ds.name}>
            {ds.name}
          </option>
        ))}
      </select>
    </div>
  );
}
