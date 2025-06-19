"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useDataset } from "@/context/DatasetContext";

type ChartData = {
  name: string;
  count: number;
};

export default function DataBarChart() {
  const { selectedDataset } = useDataset();
  const [data, setData] = useState<ChartData[]>([]);
  const [title, setTitle] = useState("Files by Dataset");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/datafiles");
        const grouped: Record<string, number> = {};

        res.data.forEach((file: any) => {
          const key = selectedDataset ? file.category : file.dataset;
          if (!key) return;
          if (selectedDataset && file.dataset !== selectedDataset) return;

          grouped[key] = (grouped[key] || 0) + 1;
        });

        const formatted = Object.entries(grouped).map(([name, count]) => ({
          name,
          count,
        }));

        setData(formatted);
        setTitle(
          selectedDataset ? `Files by Category in ${selectedDataset}` : "Files by Dataset"
        );
      } catch (err) {
        console.error("Error fetching chart data", err);
      }
    };

    fetchData();
  }, [selectedDataset]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 transition-all hover:shadow-2xl">
      <h3 className="text-md font-semibold mb-3 text-gray-800">📊 {title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#4ADE80" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
